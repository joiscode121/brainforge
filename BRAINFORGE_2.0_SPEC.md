# BrainForge 2.0 - Universal Mastery Engine

## Phase 1: Scraping Pipeline + Content Database

### Task: Build the scraping infrastructure

Create a `pipeline/` directory with Python scripts that scrape content daily.

### Scrapers to Build (pipeline/scrapers/)

1. **arxiv_scraper.py** - arXiv API (no auth needed)
   - Categories: cs.AI, cs.LG, cs.CV, cs.CL, cs.RO, physics, math, q-bio, cond-mat
   - Fetch latest 20 papers per category per day
   - Extract: title, authors, abstract, categories, pdf_url, published_date
   
2. **pubmed_scraper.py** - PubMed/NCBI E-utilities API (free)
   - Topics: pharmacology, protein design, bioengineering, cell biology, biohacking, synthetic biology, lab-grown meat, alternative protein, CRISPR, gene therapy
   - Fetch latest 20 papers per topic per day
   
3. **semantic_scholar.py** - Semantic Scholar API (free, 100 req/5min)
   - Cross-reference papers, get citation counts, find influential papers
   - Fields of study filter for nuclear physics, chemistry, robotics, space
   
4. **github_trending.py** - GitHub trending repos + specific topics
   - Languages: Python, TypeScript, Rust, Go, C++
   - Topics: cuda, kernel, chip-design, robotics, ml-ops
   
5. **devto_scraper.py** - DevTo API (free)
   - Tags: programming, webdev, python, machinelearning, devops
   - Top articles by reactions

6. **nasa_scraper.py** - NASA Open APIs (free, api.nasa.gov)
   - APOD, Mars rover, NEO, tech transfer

7. **substack_scraper.py** - Top science/tech Substacks
   - Use Jina Reader to extract content from RSS feeds
   - Sources: Astral Codex Ten, The Batch (Andrew Ng), Import AI, etc.

### Content Database (pipeline/database.py)

SQLite at ~/clawd/db/brainforge.db with tables:
- `papers` (id, source, title, authors, abstract, url, domain, scraped_at)
- `digests` (id, paper_id, summary, key_concepts JSON, prerequisites JSON, difficulty, created_at)
- `questions` (id, digest_id, domain, question, options JSON, correct_answer, explanation, difficulty)
- `flashcards` (id, digest_id, domain, front, back, difficulty)
- `study_guides` (id, digest_id, domain, title, content_md, difficulty)
- `domains` (id, name, slug, description, icon, color)
- `daily_mix` (id, date, user_id, items JSON)

### AI Digest Engine (pipeline/digest_engine.py)

Uses Claude Haiku via Anthropic API to process each paper:
- Input: raw paper title + abstract
- Output: JSON with summary, key_concepts[], prerequisites[], difficulty, questions[], flashcards[]
- Batch process: 50 papers/day = ~$2-5/day on Haiku

### Domains (16 total)

**Science:**
1. Physics/Nuclear/Quantum
2. Chemistry/Materials
3. Space/Astronomy
4. Cell Biology/Genetics
5. Pharmacology/Biohacking
6. Bioengineering/Protein Design
7. Alt Protein/Lab-Grown Meat

**Tech:**
8. AI/ML/Deep Learning
9. CUDA/GPU/Chip Design
10. Kernel/OS/Systems
11. Coding (Flask/Django/PHP/Go/Rust)
12. Systems Design/Infrastructure

**Math:**
13. Competition Math (AMC/AIME/MathCounts)
14. Pure/Applied Math

**Language/Reading:**
15. Advanced Reading (PhD-level)
16. Languages (Kannada, Hindi, Spanish, Sanskrit)

### Cron Schedule
- `0 6 * * *` - Run all scrapers
- `0 8 * * *` - Run digest engine on new papers
- `0 9 * * *` - Generate daily mix

### API Endpoints (pipeline/api.py - Express or Next.js API routes)
- GET /api/feed?domain=X - Latest digests for domain
- GET /api/daily-mix - Today's personalized mix
- GET /api/quiz?domain=X&difficulty=Y - Quiz questions
- GET /api/flashcards?domain=X - Flashcard deck
- GET /api/domains - All domains with stats
- GET /api/study-guide/:id - Full study guide
- GET /api/search?q=X - Search across all content
