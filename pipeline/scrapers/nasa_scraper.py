"""NASA Open API Scraper"""
import urllib.request
import json
import sqlite3
import os

DB_PATH = os.path.expanduser("~/clawd/db/brainforge.db")
NASA_KEY = "DEMO_KEY"

def fetch_apod():
    url = f"https://api.nasa.gov/planetary/apod?api_key={NASA_KEY}&count=5"
    req = urllib.request.Request(url, headers={"User-Agent": "BrainForge/2.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        items = json.loads(resp.read())
    
    papers = []
    for item in items:
        papers.append({
            "external_id": f"nasa:apod:{item['date']}",
            "title": item["title"],
            "authors": "NASA",
            "abstract": item.get("explanation", "")[:2000],
            "url": item.get("hdurl", item.get("url", "")),
            "published_date": item["date"],
        })
    return papers

def fetch_neo():
    """Near Earth Objects"""
    from datetime import datetime, timedelta
    today = datetime.now().strftime("%Y-%m-%d")
    url = f"https://api.nasa.gov/neo/rest/v1/feed?start_date={today}&end_date={today}&api_key={NASA_KEY}"
    req = urllib.request.Request(url, headers={"User-Agent": "BrainForge/2.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read())
    
    papers = []
    for date, neos in data.get("near_earth_objects", {}).items():
        for neo in neos[:5]:
            diameter = neo.get("estimated_diameter", {}).get("meters", {})
            min_d = diameter.get("estimated_diameter_min", 0)
            max_d = diameter.get("estimated_diameter_max", 0)
            hazard = neo.get("is_potentially_hazardous_asteroid", False)
            papers.append({
                "external_id": f"nasa:neo:{neo['id']}",
                "title": f"NEO: {neo['name']} ({min_d:.0f}-{max_d:.0f}m diameter)",
                "authors": "NASA/JPL",
                "abstract": f"Near-Earth Object {neo['name']}. Diameter: {min_d:.0f}-{max_d:.0f}m. Potentially hazardous: {hazard}. Close approach: {date}.",
                "url": neo.get("nasa_jpl_url", ""),
                "published_date": date,
            })
    return papers

def save_papers(papers):
    conn = sqlite3.connect(DB_PATH)
    saved = 0
    for p in papers:
        try:
            conn.execute("""
                INSERT OR IGNORE INTO papers 
                (source, external_id, title, authors, abstract, url, domain_slug, published_date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, ("nasa", p["external_id"], p["title"], p["authors"], p["abstract"],
                  p["url"], "space", p["published_date"]))
            saved += 1
        except: pass
    conn.commit()
    conn.close()
    return saved

def run():
    total = 0
    print("NASA APOD...")
    try:
        papers = fetch_apod()
        saved = save_papers(papers)
        print(f"  {len(papers)} items, {saved} new")
        total += saved
    except Exception as e:
        print(f"  Error: {e}")
    
    print("NASA NEO...")
    try:
        papers = fetch_neo()
        saved = save_papers(papers)
        print(f"  {len(papers)} items, {saved} new")
        total += saved
    except Exception as e:
        print(f"  Error: {e}")
    
    print(f"\nTotal new NASA items: {total}")
    return total

if __name__ == "__main__":
    run()
