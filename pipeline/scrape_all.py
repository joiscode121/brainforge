#!/usr/bin/env python3
"""Master scraper - runs all scrapers then digest engine"""
import subprocess
import sys
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))

scrapers = [
    ("arXiv", "scrapers/arxiv_scraper.py"),
    ("PubMed", "scrapers/pubmed_scraper.py"),
    ("GitHub", "scrapers/github_scraper.py"),
    ("NASA", "scrapers/nasa_scraper.py"),
]

print("=" * 50)
print("BrainForge Daily Scrape")
print("=" * 50)

for name, script in scrapers:
    print(f"\n--- {name} ---")
    subprocess.run([sys.executable, script])

print(f"\n--- AI Digest Engine ---")
subprocess.run([sys.executable, "digest_engine.py", "100"])

print("\n" + "=" * 50)
print("Daily scrape complete!")
