# BrainForge - Personal Mastery App

## Overview
Mobile-first PWA for rapid skill progression from beginner to world-class across 7 domains. Beautiful glassmorphism UI inspired by speakeasy.run aesthetic.

## Design System (CRITICAL - follow exactly)
- **Background:** Deep dark gradient (#0a0a1a to #1a0a2e) with 4 layered animated radial gradients (purple, blue, cyan, magenta) using 20s infinite animations
- **Cards:** backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl glassmorphism
- **Font:** Inter (Google Fonts) - clean, modern
- **Accent colors:** Cyan (#06b6d4), Purple (#a855f7), Blue (#3b82f6), Green (#10b981) for different domains
- **Animations:** Smooth transitions, scale on hover, fade-in on mount
- **Mobile-first:** Touch-friendly, swipeable, thumb-zone navigation
- **NO CSS scroll snap** - use smooth momentum scrolling

## Tech Stack
- Next.js 14 (App Router)
- Tailwind CSS 3.4
- TypeScript
- localStorage for progress (no backend needed for V1)
- PWA manifest + service worker for installability

## 7 Domains (each with beginner -> advanced -> world-class progression)

### 1. AI/ML Research
- Daily arXiv paper digest (curated list of landmark papers hardcoded for V1)
- Concept quizzes: neural nets, transformers, attention, GANs, diffusion, RL
- ML coding exercises (implement backprop, build a transformer, etc.)
- Levels: Beginner (what is a neuron) -> Intermediate (implement LSTM) -> Advanced (read and critique papers)

### 2. Competitive Math (TMSCA/Number Sense)
- Speed drills with countdown timer
- Mental math shortcuts: multiply 2-3 digit numbers, prime factorization tricks, squares/cubes, divisibility rules
- Algebraic speed tricks, trig identities, calc shortcuts
- Number sense test format (80 questions, 10 minutes style)
- Levels: Basic arithmetic -> Multi-digit speed -> Competition-level tricks

### 3. CS Fundamentals
- OS concepts (scheduling, memory, filesystems, concurrency)
- Data structures and algorithms (LeetCode-style with code editor)
- Systems design questions
- Levels: Beginner (arrays/loops) -> Intermediate (trees/graphs/DP) -> Advanced (distributed systems)

### 4. STEM Foundations
- Physics: mechanics, EM, thermo, quantum basics
- Engineering: circuits, signals, control systems
- Each topic: short explanation card + quiz
- Levels: Conceptual -> Quantitative -> Research-level

### 5. Reading and English
- PhD-level reading comprehension passages (science, philosophy, law)
- Vocabulary builder with spaced repetition
- Sentence completion, analogy, critical reasoning
- Writing prompts for articulation practice
- Levels: SAT -> GRE -> PhD qualifier level

### 6. Languages
- Sanskrit: Gita shlokas with transliteration + meaning
- Kannada: script learning, common phrases, grammar
- Hindi: conversation, reading, grammar
- Spanish: conversation, grammar, vocabulary
- Each with: flashcard mode, quiz mode, writing practice

### 7. AMC/Competition Math
- AMC 10/12 level problems
- AIME-style problems
- Proof-based problems
- Timed practice mode
- Solution walkthroughs with step-by-step

## Core Mechanics

### Spaced Repetition Engine
- SM-2 algorithm (like Anki) for all flashcard content
- Cards rated: Again / Hard / Good / Easy
- Review queue shown on home screen

### Daily Mix
- 15-20 min curated session pulling from weakest areas
- Mix of quiz, reading, drill across domains

### XP and Progression
- XP per correct answer (more for harder questions)
- Domain skill levels (1-100) shown as progress rings
- Daily streak counter with fire emoji
- Achievement badges

### Timed Drills
- Especially for Number Sense and Speed Math
- Countdown timer, score per minute
- Leaderboard against your own past scores

## Pages / Routes
1. / - Home dashboard: daily mix, streak, domain rings, review queue count
2. /domain/[id] - Domain page: level selector, topic list, progress
3. /quiz - Active quiz/drill view: question, timer, answer input, feedback
4. /review - Spaced repetition review queue
5. /progress - Full stats: heat map, per-domain breakdown, streak history
6. /settings - Theme, daily goal, notifications

## Content Strategy (V1)
Hardcode 20-30 questions per domain per level (beginner/intermediate/advanced). Use JSON files in /data/ directory. This gives 500+ total questions for launch.

## IMPORTANT NOTES
- Make it FUN. Not boring academic. Think Duolingo energy with PhD content.
- Every interaction should feel snappy and rewarding
- Glassmorphism everywhere - cards, modals, nav bar
- Animated gradient background on every page
- Progress should feel tangible and addictive
- Mobile-first but looks great on desktop too
- Include enough real content to be immediately usable (not just placeholder Lorem ipsum)
- Include a PWA manifest so it is installable on phone
