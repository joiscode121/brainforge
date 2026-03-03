import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/');
  const url = new URL(req.url);

  try {
    // /api/v2/domains
    if (path === 'domains') {
      const { data: domains } = await supabaseAdmin
        .from('domains')
        .select('*')
        .order('id');

      // Get counts per domain
      const { data: paperCounts } = await supabaseAdmin
        .from('papers')
        .select('domain_slug')
        .then(({ data }) => ({
          data: Object.entries(
            (data || []).reduce((acc: Record<string, number>, p) => {
              acc[p.domain_slug] = (acc[p.domain_slug] || 0) + 1;
              return acc;
            }, {})
          )
        }));

      const { data: questionCounts } = await supabaseAdmin
        .from('questions')
        .select('domain_slug')
        .then(({ data }) => ({
          data: Object.entries(
            (data || []).reduce((acc: Record<string, number>, q) => {
              acc[q.domain_slug] = (acc[q.domain_slug] || 0) + 1;
              return acc;
            }, {})
          )
        }));

      const { data: flashcardCounts } = await supabaseAdmin
        .from('flashcards')
        .select('domain_slug')
        .then(({ data }) => ({
          data: Object.entries(
            (data || []).reduce((acc: Record<string, number>, f) => {
              acc[f.domain_slug] = (acc[f.domain_slug] || 0) + 1;
              return acc;
            }, {})
          )
        }));

      const pcMap = Object.fromEntries(paperCounts || []);
      const qcMap = Object.fromEntries(questionCounts || []);
      const fcMap = Object.fromEntries(flashcardCounts || []);

      return NextResponse.json({
        domains: (domains || []).map(d => ({
          ...d,
          paper_count: pcMap[d.slug] || 0,
          question_count: qcMap[d.slug] || 0,
          flashcard_count: fcMap[d.slug] || 0,
        }))
      });
    }

    // /api/v2/stats
    if (path === 'stats') {
      const [papers, digests, questions, flashcards, domains] = await Promise.all([
        supabaseAdmin.from('papers').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('digests').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('questions').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('flashcards').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('domains').select('*', { count: 'exact', head: true }),
      ]);

      const { data: sourceData } = await supabaseAdmin
        .from('papers')
        .select('source');
      
      const bySource = Object.entries(
        (sourceData || []).reduce((acc: Record<string, number>, p) => {
          acc[p.source] = (acc[p.source] || 0) + 1;
          return acc;
        }, {})
      ).map(([source, c]) => ({ source, c }));

      const { data: domainData } = await supabaseAdmin
        .from('questions')
        .select('domain_slug');
      
      const byDomain = Object.entries(
        (domainData || []).reduce((acc: Record<string, number>, q) => {
          acc[q.domain_slug] = (acc[q.domain_slug] || 0) + 1;
          return acc;
        }, {})
      ).map(([domain_slug, c]) => ({ domain_slug, c }))
        .sort((a, b) => (b.c as number) - (a.c as number));

      return NextResponse.json({
        papers: papers.count || 0,
        digests: digests.count || 0,
        questions: questions.count || 0,
        flashcards: flashcards.count || 0,
        domains: domains.count || 0,
        bySource,
        byDomain,
      });
    }

    // /api/v2/feed?domain=X&limit=N
    if (path === 'feed') {
      const domain = url.searchParams.get('domain');
      const limit = parseInt(url.searchParams.get('limit') || '10');

      let query = supabaseAdmin
        .from('digests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (domain) query = query.eq('domain_slug', domain);

      const { data } = await query;
      return NextResponse.json({ digests: data || [] });
    }

    // /api/v2/questions?domain=X&limit=N
    if (path === 'questions') {
      const domain = url.searchParams.get('domain');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      const difficulty = url.searchParams.get('difficulty');

      let query = supabaseAdmin
        .from('questions')
        .select('*')
        .limit(limit);

      if (domain) query = query.eq('domain_slug', domain);
      if (difficulty) query = query.eq('difficulty', difficulty);

      const { data } = await query;
      return NextResponse.json({ questions: data || [] });
    }

    // /api/v2/flashcards?domain=X&limit=N
    if (path === 'flashcards') {
      const domain = url.searchParams.get('domain');
      const limit = parseInt(url.searchParams.get('limit') || '20');

      let query = supabaseAdmin
        .from('flashcards')
        .select('*')
        .limit(limit);

      if (domain) query = query.eq('domain_slug', domain);

      const { data } = await query;
      return NextResponse.json({ flashcards: data || [] });
    }

    // /api/v2/generate?domain=X&count=N&difficulty=X&topic=X
    if (path === 'generate') {
      const domain = url.searchParams.get('domain') || 'ai-ml';
      const count = Math.min(Math.max(parseInt(url.searchParams.get('count') || '10'), 1), 30);
      const difficulty = url.searchParams.get('difficulty') || 'intermediate';
      const topic = url.searchParams.get('topic') || '';

      // Get domain info
      const { data: domainData } = await supabaseAdmin
        .from('domains')
        .select('*')
        .eq('slug', domain)
        .single();

      // Get recent papers for context
      const { data: recentPapers } = await supabaseAdmin
        .from('papers')
        .select('title, abstract')
        .eq('domain_slug', domain)
        .order('scraped_at', { ascending: false })
        .limit(5);

      const paperContext = (recentPapers || [])
        .map(p => `- ${p.title}: ${(p.abstract || '').slice(0, 200)}`)
        .join('\n');

      const domainName = domainData?.name || domain;
      const topicStr = topic ? ` Focus on: ${topic}.` : '';

      const prompt = `Generate exactly ${count} ${difficulty}-level multiple choice questions about ${domainName}.${topicStr}

Recent research context:
${paperContext || 'General domain knowledge.'}

Return ONLY valid JSON array. Each object must have:
- "question": string
- "options": array of 4 strings  
- "correct_answer": integer 0-3
- "explanation": string (2-3 sentences)
- "difficulty": "${difficulty}"

No markdown, no code fences, just the JSON array.`;

      const groqKey = process.env.GROQ_API_KEY;
      if (!groqKey) {
        return NextResponse.json({ error: 'GROQ_API_KEY not configured' }, { status: 500 });
      }

      const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 4096,
        }),
      });

      const result = await resp.json();
      const content = result.choices?.[0]?.message?.content || '[]';
      
      let questions;
      try {
        const cleaned = content.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
        questions = JSON.parse(cleaned);
      } catch {
        return NextResponse.json({ error: 'Failed to parse AI response', raw: content }, { status: 500 });
      }

      // Save to Supabase
      if (Array.isArray(questions) && questions.length > 0) {
        const rows = questions.map((q: any) => ({
          domain_slug: domain,
          question: q.question,
          options: q.options,
          correct_answer: q.correct_answer,
          explanation: q.explanation,
          difficulty: q.difficulty || difficulty,
          source: 'ai-generated-ondemand',
        }));
        const { error: insertError } = await supabaseAdmin.from('questions').insert(rows);
        if (insertError) {
          console.error('Failed to save questions:', insertError.message);
        }
      }

      return NextResponse.json({
        questions: questions || [],
        domain: domainName,
        count: questions?.length || 0,
        saved: true,
      });
    }

    return NextResponse.json({ error: 'Unknown endpoint', path }, { status: 404 });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
