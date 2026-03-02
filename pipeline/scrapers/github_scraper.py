"""GitHub Trending Scraper"""
import urllib.request
import json
import sqlite3
import os
import time

DB_PATH = os.path.expanduser("~/clawd/db/brainforge.db")

TOPIC_MAP = {
    "ai-ml": ["machine-learning", "deep-learning", "transformer", "llm", "pytorch"],
    "gpu-chips": ["cuda", "gpu", "fpga", "chip-design", "verilog"],
    "kernel-os": ["linux-kernel", "operating-system", "systems-programming"],
    "coding": ["flask", "django", "rust", "golang", "typescript"],
    "systems": ["distributed-systems", "database", "kubernetes"],
}

def search_github(topic, max_results=10):
    url = f"https://api.github.com/search/repositories?q=topic:{topic}&sort=updated&order=desc&per_page={max_results}"
    headers = {"User-Agent": "BrainForge/2.0", "Accept": "application/vnd.github.v3+json"}
    pat = os.environ.get("GITHUB_TOKEN", "")
    if pat:
        headers["Authorization"] = f"token {pat}"
    
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read())
    
    papers = []
    for repo in data.get("items", []):
        papers.append({
            "external_id": f"gh:{repo['full_name']}",
            "title": f"{repo['full_name']}: {repo.get('description', '')[:100]}",
            "authors": repo["owner"]["login"],
            "abstract": repo.get("description", "") or f"GitHub repo with {repo.get('stargazers_count', 0)} stars. Language: {repo.get('language', 'Unknown')}",
            "url": repo["html_url"],
            "published_date": repo["updated_at"][:10],
            "stars": repo.get("stargazers_count", 0),
        })
    return papers

def save_papers(papers, domain_slug):
    conn = sqlite3.connect(DB_PATH)
    saved = 0
    for p in papers:
        try:
            conn.execute("""
                INSERT OR IGNORE INTO papers 
                (source, external_id, title, authors, abstract, url, domain_slug, published_date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, ("github", p["external_id"], p["title"], p["authors"], p["abstract"],
                  p["url"], domain_slug, p["published_date"]))
            saved += 1
        except: pass
    conn.commit()
    conn.close()
    return saved

def run():
    total = 0
    for domain_slug, topics in TOPIC_MAP.items():
        for topic in topics:
            print(f"GitHub: {domain_slug} - '{topic}'...")
            try:
                papers = search_github(topic, max_results=8)
                saved = save_papers(papers, domain_slug)
                print(f"  Found {len(papers)}, saved {saved} new")
                total += saved
                time.sleep(2)
            except Exception as e:
                print(f"  Error: {e}")
    print(f"\nTotal new GitHub repos: {total}")
    return total

if __name__ == "__main__":
    run()
