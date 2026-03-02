#!/usr/bin/env python3
"""BrainForge API Server - serves data from SQLite + on-demand generation"""
from http.server import HTTPServer, BaseHTTPRequestHandler
import sqlite3
import json
import os
import urllib.parse
import threading
import requests
import time

DB_PATH = os.path.expanduser("~/clawd/db/brainforge.db")
PORT = 3099
GROQ_KEY = os.environ.get("GROQ_API_KEY", "")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def generate_questions(domain_slug, count=10, difficulty="intermediate", topic=""):
    """Generate fresh questions using Groq"""
    conn = get_db()
    domain = conn.execute("SELECT * FROM domains WHERE slug = ?", (domain_slug,)).fetchone()
    domain_name = dict(domain)["name"] if domain else domain_slug
    
    # Get some existing papers for context
    papers = conn.execute(
        "SELECT title, abstract FROM papers WHERE domain_slug = ? AND abstract IS NOT NULL ORDER BY RANDOM() LIMIT 5",
        (domain_slug,)
    ).fetchall()
    conn.close()
    
    context = "\n".join(f"- {p['title']}: {p['abstract'][:200]}" for p in papers)
    topic_str = f" specifically about {topic}" if topic else ""
    
    prompt = f"""Generate exactly {count} multiple-choice quiz questions about {domain_name}{topic_str}.
Difficulty: {difficulty}

Context from recent papers in this domain:
{context}

Return ONLY valid JSON array, no markdown:
[
  {{
    "question": "Clear, specific question",
    "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
    "correct": 0,
    "explanation": "Brief explanation of why",
    "difficulty": "{difficulty}"
  }}
]

Make questions diverse, educational, and test real understanding. For {difficulty} level:
- beginner: basic definitions and concepts
- intermediate: application and analysis
- advanced: synthesis, edge cases, recent developments
- expert: research-level, cutting-edge, requires deep domain knowledge"""

    resp = requests.post("https://api.groq.com/openai/v1/chat/completions", headers={
        "Authorization": f"Bearer {GROQ_KEY}",
        "Content-Type": "application/json",
    }, json={
        "model": "llama-3.3-70b-versatile",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 4000,
        "temperature": 0.7,
    }, timeout=60)
    resp.raise_for_status()
    
    text = resp.json()["choices"][0]["message"]["content"].strip()
    if "```json" in text: text = text.split("```json")[1].split("```")[0]
    elif "```" in text: text = text.split("```")[1].split("```")[0]
    
    questions = json.loads(text)
    
    # Save to DB
    conn = sqlite3.connect(DB_PATH)
    for q in questions:
        conn.execute("""
            INSERT INTO questions (domain_slug, question, options, correct_answer, explanation, difficulty)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (domain_slug, q["question"], json.dumps(q["options"]), q["correct"],
              q.get("explanation", ""), q.get("difficulty", difficulty)))
    conn.commit()
    saved = len(questions)
    total = conn.execute("SELECT COUNT(*) FROM questions WHERE domain_slug = ?", (domain_slug,)).fetchone()[0]
    conn.close()
    
    return questions, saved, total

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        params = dict(urllib.parse.parse_qs(parsed.query))
        params = {k: v[0] if len(v) == 1 else v for k, v in params.items()}
        
        try:
            conn = get_db()
            
            if path == '/api/v2/domains':
                data = [dict(r) for r in conn.execute("""
                    SELECT d.*, 
                      (SELECT COUNT(*) FROM papers p WHERE p.domain_slug = d.slug) as paper_count,
                      (SELECT COUNT(*) FROM questions q WHERE q.domain_slug = d.slug) as question_count,
                      (SELECT COUNT(*) FROM flashcards f WHERE f.domain_slug = d.slug) as flashcard_count
                    FROM domains d ORDER BY d.category, d.name
                """).fetchall()]
                self.respond({"domains": data})
            
            elif path == '/api/v2/feed':
                domain = params.get('domain', '')
                limit = int(params.get('limit', '20'))
                q = """SELECT d.*, p.title, p.authors, p.url, p.source, p.published_date, p.domain_slug
                       FROM digests d JOIN papers p ON p.id = d.paper_id"""
                args = []
                if domain: q += ' WHERE p.domain_slug = ?'; args.append(domain)
                q += ' ORDER BY d.created_at DESC LIMIT ?'; args.append(limit)
                data = [dict(r) for r in conn.execute(q, args).fetchall()]
                for d in data:
                    if d.get('key_concepts'): d['key_concepts'] = json.loads(d['key_concepts'])
                    if d.get('prerequisites'): d['prerequisites'] = json.loads(d['prerequisites'])
                self.respond({"digests": data})
            
            elif path == '/api/v2/quiz':
                domain = params.get('domain', '')
                difficulty = params.get('difficulty', '')
                limit = int(params.get('limit', '10'))
                q = 'SELECT * FROM questions WHERE 1=1'
                args = []
                if domain: q += ' AND domain_slug = ?'; args.append(domain)
                if difficulty: q += ' AND difficulty = ?'; args.append(difficulty)
                q += ' ORDER BY RANDOM() LIMIT ?'; args.append(limit)
                data = [dict(r) for r in conn.execute(q, args).fetchall()]
                for d in data: d['options'] = json.loads(d['options'])
                self.respond({"questions": data})
            
            elif path == '/api/v2/generate':
                domain = params.get('domain', '')
                count = int(params.get('count', '10'))
                difficulty = params.get('difficulty', 'intermediate')
                topic = params.get('topic', '')
                
                if not domain:
                    self.respond({"error": "domain parameter required"}, 400)
                    conn.close()
                    return
                
                count = min(count, 30)  # Cap at 30
                
                try:
                    questions, saved, total = generate_questions(domain, count, difficulty, topic)
                    self.respond({
                        "questions": questions,
                        "generated": saved,
                        "totalInDomain": total,
                        "domain": domain,
                        "difficulty": difficulty,
                    })
                except Exception as e:
                    self.respond({"error": f"Generation failed: {str(e)}"}, 500)
            
            elif path == '/api/v2/flashcards':
                domain = params.get('domain', '')
                limit = int(params.get('limit', '20'))
                q = 'SELECT * FROM flashcards WHERE 1=1'
                args = []
                if domain: q += ' AND domain_slug = ?'; args.append(domain)
                q += ' ORDER BY RANDOM() LIMIT ?'; args.append(limit)
                data = [dict(r) for r in conn.execute(q, args).fetchall()]
                self.respond({"flashcards": data})
            
            elif path == '/api/v2/daily-mix':
                questions = [dict(r) for r in conn.execute("""
                    SELECT q.*, d.name as domain_name, d.color as domain_color
                    FROM questions q JOIN domains d ON d.slug = q.domain_slug
                    ORDER BY RANDOM() LIMIT 15
                """).fetchall()]
                for q in questions: q['options'] = json.loads(q['options'])
                flashcards = [dict(r) for r in conn.execute("""
                    SELECT f.*, d.name as domain_name
                    FROM flashcards f JOIN domains d ON d.slug = f.domain_slug
                    ORDER BY RANDOM() LIMIT 10
                """).fetchall()]
                self.respond({"questions": questions, "flashcards": flashcards})
            
            elif path == '/api/v2/stats':
                stats = {
                    "papers": conn.execute('SELECT COUNT(*) FROM papers').fetchone()[0],
                    "digests": conn.execute('SELECT COUNT(*) FROM digests').fetchone()[0],
                    "questions": conn.execute('SELECT COUNT(*) FROM questions').fetchone()[0],
                    "flashcards": conn.execute('SELECT COUNT(*) FROM flashcards').fetchone()[0],
                    "domains": conn.execute('SELECT COUNT(*) FROM domains').fetchone()[0],
                    "lastScrape": conn.execute('SELECT MAX(scraped_at) FROM papers').fetchone()[0],
                    "bySource": [dict(r) for r in conn.execute('SELECT source, COUNT(*) as c FROM papers GROUP BY source').fetchall()],
                    "byDomain": [dict(r) for r in conn.execute('SELECT domain_slug, COUNT(*) as c FROM questions GROUP BY domain_slug ORDER BY c DESC').fetchall()],
                }
                self.respond(stats)
            
            elif path.startswith('/api/v2/paper/'):
                pid = path.split('/')[-1]
                paper = conn.execute('SELECT * FROM papers WHERE id = ?', (pid,)).fetchone()
                if not paper:
                    self.respond({"error": "Not found"}, 404)
                    conn.close()
                    return
                paper = dict(paper)
                digest_row = conn.execute('SELECT * FROM digests WHERE paper_id = ?', (pid,)).fetchone()
                digest = dict(digest_row) if digest_row else None
                if digest:
                    digest['key_concepts'] = json.loads(digest.get('key_concepts', '[]') or '[]')
                    digest['prerequisites'] = json.loads(digest.get('prerequisites', '[]') or '[]')
                questions = [dict(r) for r in conn.execute('SELECT * FROM questions WHERE paper_id = ?', (pid,)).fetchall()]
                for q in questions: q['options'] = json.loads(q['options'])
                self.respond({"paper": paper, "digest": digest, "questions": questions})
            
            else:
                self.respond({"error": "Not found"}, 404)
            
            conn.close()
        except Exception as e:
            self.respond({"error": str(e)}, 500)
    
    def respond(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
    
    def log_message(self, format, *args): pass

if __name__ == '__main__':
    print(f"BrainForge API running on port {PORT}")
    HTTPServer(('127.0.0.1', PORT), Handler).serve_forever()
