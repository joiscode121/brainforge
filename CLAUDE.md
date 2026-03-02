# BrainForge 2.0 - Frontend Upgrade

You are upgrading BrainForge from a static quiz app to a dynamic learning engine powered by a SQLite database of scraped papers, digests, questions, and flashcards.

## Database Location
`~/clawd/db/brainforge.db`

## Tables
- `domains` (id, name, slug, description, icon, color, category)
- `papers` (id, source, title, authors, abstract, url, domain_slug, published_date)
- `digests` (id, paper_id, summary, why_it_matters, key_concepts JSON, prerequisites JSON, difficulty)
- `questions` (id, digest_id, paper_id, domain_slug, question, options JSON, correct_answer, explanation, difficulty)
- `flashcards` (id, digest_id, domain_slug, front, back, difficulty)

## Current State
- 355+ papers across 14 domains from arXiv, PubMed, GitHub, NASA
- 200+ questions and 150+ flashcards generated from AI digest pipeline
- Existing frontend has basic quiz, domains, review, progress, settings pages

## Your Task: Build New API Routes + Update Frontend

### 1. New API Routes (app/api/)

Create these Next.js API routes that read from the SQLite DB:

- `GET /api/v2/domains` - List all 16 domains with paper/question counts
- `GET /api/v2/feed?domain=X&limit=20` - Latest digests for a domain
- `GET /api/v2/quiz?domain=X&difficulty=Y&limit=10` - Random quiz questions
- `GET /api/v2/flashcards?domain=X&limit=20` - Flashcard deck
- `GET /api/v2/daily-mix` - Mix of questions across all domains (weighted by SR schedule)
- `GET /api/v2/stats` - Overall stats (papers, questions, domains, last scrape time)
- `GET /api/v2/paper/:id` - Full paper digest detail

### 2. Update Pages

#### Home Page (app/page.tsx)
- Show daily stats: papers scraped, questions available, streak
- "Daily Mix" button - launches mixed quiz from all domains
- Domain grid showing all 16 domains with icons, colors, and question counts
- Recent papers section (latest 5 digests)

#### Domain Detail (app/domain/[slug]/page.tsx)  
- Domain header with description, paper count, question count
- Tabs: Feed (latest digests) | Quiz | Flashcards
- Feed shows paper digests in card format with "why it matters"

#### Quiz Page (app/quiz/page.tsx)
- Pull questions from /api/v2/quiz
- Beautiful card-based quiz UI
- Show explanation after answering
- Track score, time, streaks

#### Flashcards Page (app/flashcards/page.tsx)
- Swipeable flashcard deck from /api/v2/flashcards
- Flip animation
- Mark as known/unknown (feeds into SR)

### Design Rules
- Dark theme with warm palette (#0a0908 base, amber accents)
- NO emojis in UI elements
- NO fake/mock data - only real DB data
- Mobile-first, PWA-ready
- Glassmorphism cards with subtle borders
- Inter font throughout

### Tech
- Next.js 14 App Router (already set up)
- better-sqlite3 for DB access in API routes
- Tailwind CSS (already configured)
- localStorage for progress tracking

### Install better-sqlite3
Run: npm install better-sqlite3 @types/better-sqlite3
