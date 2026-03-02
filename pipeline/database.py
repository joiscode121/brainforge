"""BrainForge Content Database"""
import sqlite3
import json
import os
from datetime import datetime

DB_PATH = os.path.expanduser("~/clawd/db/brainforge.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn

def init_db():
    conn = get_db()
    conn.executescript("""
    CREATE TABLE IF NOT EXISTS domains (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        icon TEXT,
        color TEXT,
        category TEXT
    );
    
    CREATE TABLE IF NOT EXISTS papers (
        id INTEGER PRIMARY KEY,
        source TEXT NOT NULL,
        external_id TEXT,
        title TEXT NOT NULL,
        authors TEXT,
        abstract TEXT,
        url TEXT,
        pdf_url TEXT,
        domain_id INTEGER REFERENCES domains(id),
        domain_slug TEXT,
        published_date TEXT,
        citation_count INTEGER DEFAULT 0,
        scraped_at TEXT DEFAULT (datetime('now')),
        UNIQUE(source, external_id)
    );
    
    CREATE TABLE IF NOT EXISTS digests (
        id INTEGER PRIMARY KEY,
        paper_id INTEGER REFERENCES papers(id),
        summary TEXT,
        why_it_matters TEXT,
        key_concepts TEXT,
        prerequisites TEXT,
        difficulty TEXT CHECK(difficulty IN ('beginner','intermediate','advanced','expert')),
        created_at TEXT DEFAULT (datetime('now'))
    );
    
    CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY,
        digest_id INTEGER REFERENCES digests(id),
        paper_id INTEGER REFERENCES papers(id),
        domain_slug TEXT,
        question TEXT NOT NULL,
        options TEXT NOT NULL,
        correct_answer INTEGER NOT NULL,
        explanation TEXT,
        difficulty TEXT,
        created_at TEXT DEFAULT (datetime('now'))
    );
    
    CREATE TABLE IF NOT EXISTS flashcards (
        id INTEGER PRIMARY KEY,
        digest_id INTEGER REFERENCES digests(id),
        domain_slug TEXT,
        front TEXT NOT NULL,
        back TEXT NOT NULL,
        difficulty TEXT,
        created_at TEXT DEFAULT (datetime('now'))
    );
    
    CREATE TABLE IF NOT EXISTS study_guides (
        id INTEGER PRIMARY KEY,
        digest_id INTEGER REFERENCES digests(id),
        domain_slug TEXT,
        title TEXT NOT NULL,
        content_md TEXT NOT NULL,
        difficulty TEXT,
        created_at TEXT DEFAULT (datetime('now'))
    );
    
    CREATE TABLE IF NOT EXISTS daily_mix (
        id INTEGER PRIMARY KEY,
        date TEXT NOT NULL,
        items TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
    );
    
    CREATE INDEX IF NOT EXISTS idx_papers_domain ON papers(domain_slug);
    CREATE INDEX IF NOT EXISTS idx_papers_source ON papers(source);
    CREATE INDEX IF NOT EXISTS idx_questions_domain ON questions(domain_slug);
    CREATE INDEX IF NOT EXISTS idx_flashcards_domain ON flashcards(domain_slug);
    CREATE INDEX IF NOT EXISTS idx_digests_paper ON digests(paper_id);
    """)
    
    # Seed domains
    domains = [
        ("Physics & Quantum", "physics", "Nuclear physics, quantum mechanics, particle physics", "atom", "#8b5cf6", "science"),
        ("Chemistry & Materials", "chemistry", "Chemical research, materials science, nanotechnology", "flask", "#06b6d4", "science"),
        ("Space & Astronomy", "space", "Astrophysics, cosmology, planetary science, NASA", "rocket", "#3b82f6", "science"),
        ("Cell Biology & Genetics", "cell-bio", "Genomics, CRISPR, gene therapy, molecular biology", "dna", "#22c55e", "science"),
        ("Pharmacology & Biohacking", "pharma", "Drug design, nootropics, longevity, biohacking", "pill", "#ef4444", "science"),
        ("Bioengineering & Protein Design", "bioeng", "Synthetic biology, protein folding, tissue engineering", "microscope", "#f59e0b", "science"),
        ("Alt Protein & Lab-Grown Meat", "alt-protein", "Cellular agriculture, fermentation, plant-based tech", "leaf", "#10b981", "science"),
        ("AI & Machine Learning", "ai-ml", "Deep learning, transformers, reinforcement learning, LLMs", "brain", "#a855f7", "tech"),
        ("CUDA & Chip Design", "gpu-chips", "GPU programming, ASIC design, hardware acceleration", "chip", "#f97316", "tech"),
        ("Kernel & OS", "kernel-os", "Linux kernel, operating systems, drivers, systems programming", "terminal", "#64748b", "tech"),
        ("Coding Mastery", "coding", "Flask, Django, PHP, Go, Rust, TypeScript, full-stack", "code", "#0ea5e9", "tech"),
        ("Systems Design", "systems", "Distributed systems, databases, networking, infrastructure", "server", "#8b5e34", "tech"),
        ("Competition Math", "comp-math", "AMC, AIME, MathCounts, Olympiad, Project Euler", "trophy", "#eab308", "math"),
        ("Pure & Applied Math", "pure-math", "Linear algebra, calculus, probability, topology", "sigma", "#6366f1", "math"),
        ("Advanced Reading", "reading", "PhD-level comprehension, GRE/SAT++, critical analysis", "book", "#be185d", "language"),
        ("Languages", "languages", "Kannada, Hindi, Spanish, Sanskrit - basics to expert", "globe", "#14b8a6", "language"),
    ]
    
    for d in domains:
        conn.execute(
            "INSERT OR IGNORE INTO domains (name, slug, description, icon, color, category) VALUES (?,?,?,?,?,?)",
            d
        )
    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print(f"Database initialized at {DB_PATH}")
    conn = get_db()
    count = conn.execute("SELECT COUNT(*) FROM domains").fetchone()[0]
    print(f"{count} domains seeded")
    conn.close()
