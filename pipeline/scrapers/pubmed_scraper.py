"""PubMed/NCBI Scraper - biomedical research papers"""
import urllib.request
import urllib.parse
import json
import sqlite3
import os
import time
import xml.etree.ElementTree as ET

DB_PATH = os.path.expanduser("~/clawd/db/brainforge.db")
BASE_SEARCH = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
BASE_FETCH = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi"

TOPIC_MAP = {
    "pharma": ["pharmacology drug design", "nootropics cognitive enhancement", "longevity biohacking aging"],
    "bioeng": ["protein design engineering", "synthetic biology", "tissue engineering bioprinting"],
    "cell-bio": ["CRISPR gene editing 2024", "cell biology signaling", "genomics sequencing"],
    "alt-protein": ["lab grown meat cellular agriculture", "alternative protein fermentation", "plant based protein technology"],
    "chemistry": ["nanomaterials synthesis", "catalysis materials science"],
}

def search_pubmed(query, max_results=10):
    params = {"db": "pubmed", "term": query, "retmax": max_results, "sort": "date", "retmode": "json"}
    url = f"{BASE_SEARCH}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers={"User-Agent": "BrainForge/2.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read())
    return data.get("esearchresult", {}).get("idlist", [])

def fetch_details(pmids):
    if not pmids: return []
    params = {"db": "pubmed", "id": ",".join(pmids), "rettype": "abstract", "retmode": "xml"}
    url = f"{BASE_FETCH}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers={"User-Agent": "BrainForge/2.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        root = ET.fromstring(resp.read())
    
    papers = []
    for article in root.findall(".//PubmedArticle"):
        try:
            pmid = article.find(".//PMID").text
            title = article.find(".//ArticleTitle").text or ""
            abstract_parts = article.findall(".//AbstractText")
            abstract = " ".join(a.text or "" for a in abstract_parts)[:2000]
            authors_el = article.findall(".//Author")
            authors = ", ".join(
                f"{a.find('LastName').text} {a.find('ForeName').text}"
                for a in authors_el[:5] if a.find("LastName") is not None and a.find("ForeName") is not None
            )
            year = article.find(".//PubDate/Year")
            pub_date = year.text if year is not None else ""
            
            papers.append({
                "external_id": f"pmid:{pmid}",
                "title": title,
                "authors": authors,
                "abstract": abstract,
                "url": f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/",
                "published_date": pub_date,
            })
        except Exception as e:
            continue
    return papers

def save_papers(papers, domain_slug):
    conn = sqlite3.connect(DB_PATH)
    saved = 0
    for p in papers:
        try:
            conn.execute("""
                INSERT OR IGNORE INTO papers 
                (source, external_id, title, authors, abstract, url, pdf_url, domain_slug, published_date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, ("pubmed", p["external_id"], p["title"], p["authors"], p["abstract"],
                  p["url"], "", domain_slug, p["published_date"]))
            saved += 1
        except: pass
    conn.commit()
    conn.close()
    return saved

def run():
    total = 0
    for domain_slug, queries in TOPIC_MAP.items():
        for q in queries:
            print(f"PubMed: {domain_slug} - '{q}'...")
            try:
                pmids = search_pubmed(q, max_results=8)
                papers = fetch_details(pmids)
                saved = save_papers(papers, domain_slug)
                print(f"  Found {len(papers)}, saved {saved} new")
                total += saved
                time.sleep(1)
            except Exception as e:
                print(f"  Error: {e}")
    print(f"\nTotal new PubMed papers: {total}")
    return total

if __name__ == "__main__":
    run()
