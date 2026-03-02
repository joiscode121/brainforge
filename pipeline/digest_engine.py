"""AI Digest Engine - processes papers into learning content using Groq (free)"""
import sqlite3
import json
import os
import requests
import time

DB_PATH = os.path.expanduser("~/clawd/db/brainforge.db")
GROQ_KEY = os.environ.get("GROQ_API_KEY", "")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

def call_llm(prompt, max_tokens=2000):
    resp = requests.post(GROQ_URL, headers={
        "Authorization": f"Bearer {GROQ_KEY}",
        "Content-Type": "application/json",
    }, json={
        "model": "llama-3.3-70b-versatile",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": max_tokens,
        "temperature": 0.3,
    }, timeout=60)
    resp.raise_for_status()
    return resp.json()["choices"][0]["message"]["content"]

def digest_paper(paper):
    prompt = f"""Analyze this research paper/project and create learning content. Return ONLY valid JSON, no markdown.

Title: {paper['title']}
Abstract: {paper['abstract'][:1200]}
Source: {paper['source']}
Domain: {paper['domain_slug']}

Return this exact JSON structure:
{{
  "summary": "2-3 sentence plain English summary",
  "why_it_matters": "1 sentence on real-world impact",
  "key_concepts": ["concept1", "concept2", "concept3"],
  "prerequisites": ["prereq1", "prereq2"],
  "difficulty": "beginner|intermediate|advanced|expert",
  "questions": [
    {{"question": "Clear question testing understanding", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": 0, "explanation": "Why this answer is correct"}},
    {{"question": "Second question", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": 1, "explanation": "Why"}},
    {{"question": "Third question", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": 2, "explanation": "Why"}}
  ],
  "flashcards": [
    {{"front": "Key term", "back": "Definition"}},
    {{"front": "Another term", "back": "Definition"}}
  ]
}}"""
    
    response = call_llm(prompt)
    text = response.strip()
    if "```json" in text: text = text.split("```json")[1].split("```")[0]
    elif "```" in text: text = text.split("```")[1].split("```")[0]
    return json.loads(text)

def save_digest(paper_id, domain_slug, d):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.execute("""
        INSERT INTO digests (paper_id, summary, why_it_matters, key_concepts, prerequisites, difficulty)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (paper_id, d.get("summary",""), d.get("why_it_matters",""),
          json.dumps(d.get("key_concepts",[])), json.dumps(d.get("prerequisites",[])),
          d.get("difficulty","intermediate")))
    digest_id = cur.lastrowid
    
    for q in d.get("questions", []):
        conn.execute("""
            INSERT INTO questions (digest_id, paper_id, domain_slug, question, options, correct_answer, explanation, difficulty)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (digest_id, paper_id, domain_slug, q["question"], json.dumps(q["options"]),
              q["correct"], q.get("explanation",""), d.get("difficulty","intermediate")))
    
    for f in d.get("flashcards", []):
        conn.execute("""
            INSERT INTO flashcards (digest_id, domain_slug, front, back, difficulty)
            VALUES (?, ?, ?, ?, ?)
        """, (digest_id, domain_slug, f["front"], f["back"], d.get("difficulty","intermediate")))
    
    conn.commit()
    conn.close()
    return digest_id

def run(limit=50):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    papers = conn.execute("""
        SELECT p.* FROM papers p
        LEFT JOIN digests d ON d.paper_id = p.id
        WHERE d.id IS NULL AND p.abstract IS NOT NULL AND length(p.abstract) > 50
        ORDER BY p.scraped_at DESC LIMIT ?
    """, (limit,)).fetchall()
    conn.close()
    
    print(f"Processing {len(papers)} undigested papers...")
    success = errors = 0
    
    for i, paper in enumerate(papers):
        print(f"  [{i+1}/{len(papers)}] {paper['title'][:60]}...")
        try:
            data = digest_paper(dict(paper))
            save_digest(paper["id"], paper["domain_slug"], data)
            success += 1
            time.sleep(1)  # Groq rate limit
        except Exception as e:
            print(f"    Error: {str(e)[:100]}")
            errors += 1
            time.sleep(2)
    
    print(f"\nDigested: {success} success, {errors} errors")
    conn = sqlite3.connect(DB_PATH)
    print(f"Total: {conn.execute('SELECT COUNT(*) FROM digests').fetchone()[0]} digests, "
          f"{conn.execute('SELECT COUNT(*) FROM questions').fetchone()[0]} questions, "
          f"{conn.execute('SELECT COUNT(*) FROM flashcards').fetchone()[0]} flashcards")
    conn.close()

if __name__ == "__main__":
    import sys
    run(int(sys.argv[1]) if len(sys.argv) > 1 else 30)
