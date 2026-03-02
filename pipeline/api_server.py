#!/usr/bin/env python3
"""BrainForge API Server - serves data from SQLite to frontend"""
from http.server import HTTPServer, BaseHTTPRequestHandler
import sqlite3
import json
import os
import urllib.parse

DB_PATH = os.path.expanduser("~/clawd/db/brainforge.db")
PORT = 3099

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        params = dict(urllib.parse.parse_qs(parsed.query))
        # Flatten single-value params
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
                paper = dict(conn.execute('SELECT * FROM papers WHERE id = ?', (pid,)).fetchone() or {})
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
    
    def log_message(self, format, *args): pass  # Silence logs

if __name__ == '__main__':
    print(f"BrainForge API running on port {PORT}")
    HTTPServer(('127.0.0.1', PORT), Handler).serve_forever()
