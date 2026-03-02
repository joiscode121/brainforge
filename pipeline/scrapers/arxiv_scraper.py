"""arXiv Paper Scraper - fetches latest papers across science/tech domains"""
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
import sqlite3
import json
import os
import time
from datetime import datetime, timedelta

DB_PATH = os.path.expanduser("~/clawd/db/brainforge.db")

# arXiv categories mapped to our domains
CATEGORY_MAP = {
    "physics": ["hep-ph", "hep-th", "quant-ph", "nucl-th", "nucl-ex", "physics.atom-ph"],
    "chemistry": ["cond-mat.mtrl-sci", "physics.chem-ph"],
    "space": ["astro-ph", "astro-ph.EP", "astro-ph.HE", "astro-ph.CO"],
    "cell-bio": ["q-bio.BM", "q-bio.GN", "q-bio.CB", "q-bio.MN"],
    "bioeng": ["q-bio.BM", "q-bio.QM"],
    "ai-ml": ["cs.AI", "cs.LG", "cs.CV", "cs.CL", "cs.NE"],
    "gpu-chips": ["cs.AR", "cs.DC", "cs.PF"],
    "kernel-os": ["cs.OS", "cs.SE"],
    "systems": ["cs.DB", "cs.DC", "cs.NI"],
    "comp-math": ["math.CO", "math.NT"],
    "pure-math": ["math.AG", "math.AT", "math.FA", "math.PR"],
}

BASE_URL = "http://export.arxiv.org/api/query"

def fetch_papers(categories, max_results=15):
    """Fetch papers from arXiv API"""
    cat_query = " OR ".join(f"cat:{c}" for c in categories)
    params = {
        "search_query": cat_query,
        "start": 0,
        "max_results": max_results,
        "sortBy": "submittedDate",
        "sortOrder": "descending",
    }
    url = f"{BASE_URL}?{urllib.parse.urlencode(params)}"
    
    req = urllib.request.Request(url, headers={"User-Agent": "BrainForge/2.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = resp.read().decode("utf-8")
    
    ns = {"atom": "http://www.w3.org/2005/Atom", "arxiv": "http://arxiv.org/schemas/atom"}
    root = ET.fromstring(data)
    
    papers = []
    for entry in root.findall("atom:entry", ns):
        arxiv_id = entry.find("atom:id", ns).text.split("/abs/")[-1]
        title = entry.find("atom:title", ns).text.strip().replace("\n", " ")
        abstract = entry.find("atom:summary", ns).text.strip().replace("\n", " ")
        authors = ", ".join(a.find("atom:name", ns).text for a in entry.findall("atom:author", ns))
        published = entry.find("atom:published", ns).text[:10]
        
        pdf_url = ""
        for link in entry.findall("atom:link", ns):
            if link.get("title") == "pdf":
                pdf_url = link.get("href")
        
        papers.append({
            "external_id": arxiv_id,
            "title": title,
            "authors": authors,
            "abstract": abstract[:2000],
            "url": f"https://arxiv.org/abs/{arxiv_id}",
            "pdf_url": pdf_url,
            "published_date": published,
        })
    
    return papers

def save_papers(papers, domain_slug, source="arxiv"):
    """Save papers to database"""
    conn = sqlite3.connect(DB_PATH)
    saved = 0
    for p in papers:
        try:
            conn.execute("""
                INSERT OR IGNORE INTO papers 
                (source, external_id, title, authors, abstract, url, pdf_url, domain_slug, published_date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (source, p["external_id"], p["title"], p["authors"], p["abstract"],
                  p["url"], p["pdf_url"], domain_slug, p["published_date"]))
            saved += 1
        except Exception as e:
            print(f"  Error saving {p['title'][:50]}: {e}")
    conn.commit()
    conn.close()
    return saved

def run():
    """Run full arXiv scrape"""
    total = 0
    for domain_slug, categories in CATEGORY_MAP.items():
        print(f"Scraping arXiv for {domain_slug} ({', '.join(categories)})...")
        try:
            papers = fetch_papers(categories, max_results=15)
            saved = save_papers(papers, domain_slug)
            print(f"  Found {len(papers)}, saved {saved} new")
            total += saved
            time.sleep(3)  # Rate limit: be nice to arXiv
        except Exception as e:
            print(f"  Error: {e}")
    
    print(f"\nTotal new papers saved: {total}")
    return total

if __name__ == "__main__":
    run()
