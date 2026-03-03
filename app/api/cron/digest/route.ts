import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

async function generateDigest(paper: any, groqKey: string) {
  const prompt = `Analyze this research paper and return ONLY valid JSON (no markdown):
Title: ${paper.title}
Abstract: ${(paper.abstract || '').slice(0, 1000)}
Source: ${paper.source}

Return JSON:
{
  "summary": "2-3 sentence summary of key findings",
  "why_it_matters": "1-2 sentences on real-world impact",
  "difficulty": "beginner|intermediate|advanced",
  "questions": [
    {"question": "...", "options": ["A","B","C","D"], "correct_answer": 0, "explanation": "..."},
    {"question": "...", "options": ["A","B","C","D"], "correct_answer": 0, "explanation": "..."},
    {"question": "...", "options": ["A","B","C","D"], "correct_answer": 0, "explanation": "..."}
  ],
  "flashcards": [
    {"front": "concept or question", "back": "explanation or answer"},
    {"front": "concept or question", "back": "explanation or answer"}
  ]
}`;

  const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${groqKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 2048,
    }),
  });

  const result = await resp.json();
  const content = result.choices?.[0]?.message?.content || '';
  const cleaned = content.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned);
}

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.get('authorization');
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) return NextResponse.json({ error: 'No GROQ_API_KEY' }, { status: 500 });

  try {
    // Find papers without digests (limit to 10 per run to stay within time)
    const { data: digestedPaperIds } = await supabaseAdmin
      .from('digests')
      .select('paper_id');
    
    const digestedSet = new Set((digestedPaperIds || []).map(d => d.paper_id));

    const { data: allPapers } = await supabaseAdmin
      .from('papers')
      .select('*')
      .order('scraped_at', { ascending: false })
      .limit(200);

    const undigested = (allPapers || []).filter(p => !digestedSet.has(p.id));
    const toProcess = undigested.slice(0, 10); // 10 per run

    let digestCount = 0, questionCount = 0, flashcardCount = 0;

    for (const paper of toProcess) {
      try {
        const result = await generateDigest(paper, groqKey);

        // Insert digest
        await supabaseAdmin.from('digests').insert({
          paper_id: paper.id,
          domain_slug: paper.domain_slug,
          title: paper.title,
          summary: result.summary,
          why_it_matters: result.why_it_matters,
          difficulty: result.difficulty || 'intermediate',
          source: paper.source,
          url: paper.url,
          published_date: paper.published_date,
        });
        digestCount++;

        // Insert questions
        if (result.questions?.length) {
          const qRows = result.questions.map((q: any) => ({
            domain_slug: paper.domain_slug,
            question: q.question,
            options: q.options,
            correct_answer: q.correct_answer,
            explanation: q.explanation,
            difficulty: result.difficulty || 'intermediate',
            source: `digest-${paper.source}`,
          }));
          const { error } = await supabaseAdmin.from('questions').insert(qRows);
          if (!error) questionCount += qRows.length;
        }

        // Insert flashcards
        if (result.flashcards?.length) {
          const fRows = result.flashcards.map((f: any) => ({
            domain_slug: paper.domain_slug,
            front: f.front,
            back: f.back,
            difficulty: result.difficulty || 'intermediate',
            source: `digest-${paper.source}`,
          }));
          const { error } = await supabaseAdmin.from('flashcards').insert(fRows);
          if (!error) flashcardCount += fRows.length;
        }

        // Rate limit Groq
        await new Promise(r => setTimeout(r, 1500));
      } catch (e: any) {
        console.error(`Digest error for paper ${paper.id}:`, e.message);
      }
    }

    return NextResponse.json({
      success: true,
      undigested: undigested.length,
      processed: toProcess.length,
      digests: digestCount,
      questions: questionCount,
      flashcards: flashcardCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
