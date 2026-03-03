import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// ═══════════════════════════════════════════
// arXiv Scraper
// ═══════════════════════════════════════════
const ARXIV_CATEGORIES: Record<string, string[]> = {
  'physics': ['hep-ph', 'hep-th', 'quant-ph', 'nucl-th'],
  'chemistry': ['cond-mat.mtrl-sci', 'physics.chem-ph'],
  'space': ['astro-ph', 'astro-ph.EP', 'astro-ph.HE', 'astro-ph.CO'],
  'cell-bio': ['q-bio.BM', 'q-bio.GN', 'q-bio.CB'],
  'bioeng': ['q-bio.BM', 'q-bio.QM'],
  'ai-ml': ['cs.AI', 'cs.LG', 'cs.CV', 'cs.CL', 'cs.NE'],
  'gpu-chips': ['cs.AR', 'cs.DC', 'cs.PF'],
  'kernel-os': ['cs.OS', 'cs.SE'],
  'systems': ['cs.DB', 'cs.DC', 'cs.NI'],
  'comp-math': ['math.CO', 'math.NT'],
  'pure-math': ['math.AG', 'math.AT', 'math.FA', 'math.PR'],
};

async function scrapeArxiv() {
  const papers: any[] = [];
  for (const [domain, categories] of Object.entries(ARXIV_CATEGORIES)) {
    const catQuery = categories.map(c => `cat:${c}`).join('+OR+');
    const url = `http://export.arxiv.org/api/query?search_query=${catQuery}&start=0&max_results=5&sortBy=submittedDate&sortOrder=descending`;
    try {
      const resp = await fetch(url);
      const xml = await resp.text();
      const entries = xml.split('<entry>').slice(1);
      for (const entry of entries) {
        const title = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.replace(/\n/g, ' ').trim() || '';
        const link = entry.match(/<id>(.*?)<\/id>/)?.[1] || '';
        const summary = entry.match(/<summary>([\s\S]*?)<\/summary>/)?.[1]?.replace(/\n/g, ' ').trim() || '';
        const published = entry.match(/<published>(.*?)<\/published>/)?.[1] || '';
        const authorMatches = Array.from(entry.matchAll(/<name>(.*?)<\/name>/g));
        const authors = authorMatches.map(m => m[1]).join(', ');
        if (title && link) {
          papers.push({ domain_slug: domain, title: title.slice(0, 500), url: link, source: 'arxiv', authors: authors.slice(0, 500), abstract: summary.slice(0, 2000), published_date: published.split('T')[0] });
        }
      }
    } catch (e) { console.error(`arXiv ${domain}:`, e); }
    await new Promise(r => setTimeout(r, 500));
  }
  return papers;
}

// ═══════════════════════════════════════════
// PubMed Scraper
// ═══════════════════════════════════════════
const PUBMED_TOPICS: Record<string, string[]> = {
  'pharma': ['pharmacology drug design 2025', 'nootropics cognitive enhancement', 'longevity biohacking'],
  'cell-bio': ['cell biology genomics CRISPR 2025', 'synthetic biology'],
  'bioeng': ['tissue engineering 2025', 'protein design bioengineering'],
  'alt-protein': ['lab grown meat 2025', 'alternative protein cultured'],
  'chemistry': ['nanomaterials catalysis 2025', 'materials science advanced'],
};

async function scrapePubmed() {
  const papers: any[] = [];
  const BASE = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
  for (const [domain, queries] of Object.entries(PUBMED_TOPICS)) {
    for (const query of queries) {
      try {
        const searchUrl = `${BASE}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=3&sort=date&retmode=json`;
        const searchResp = await fetch(searchUrl);
        const searchData = await searchResp.json();
        const ids = searchData.esearchresult?.idlist || [];
        if (ids.length === 0) continue;
        const detailUrl = `${BASE}/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`;
        const detailResp = await fetch(detailUrl);
        const detailData = await detailResp.json();
        for (const id of ids) {
          const a = detailData.result?.[id];
          if (!a) continue;
          papers.push({ domain_slug: domain, title: (a.title || '').slice(0, 500), url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`, source: 'pubmed', authors: (a.authors || []).map((x: any) => x.name).join(', ').slice(0, 500), abstract: (a.sorttitle || '').slice(0, 2000), published_date: a.pubdate || '' });
        }
      } catch (e) { console.error(`PubMed ${domain}/${query}:`, e); }
      await new Promise(r => setTimeout(r, 400));
    }
  }
  return papers;
}

// ═══════════════════════════════════════════
// GitHub Trending
// ═══════════════════════════════════════════
const GITHUB_QUERIES: Record<string, string[]> = {
  'ai-ml': ['machine learning', 'transformer neural network', 'LLM agent'],
  'gpu-chips': ['CUDA GPU optimization', 'hardware accelerator'],
  'coding': ['developer tools CLI', 'code generation AI'],
  'systems': ['distributed systems database', 'infrastructure kubernetes'],
  'kernel-os': ['operating system kernel', 'systems programming rust'],
};

async function scrapeGithub() {
  const papers: any[] = [];
  const token = process.env.GITHUB_TOKEN || '';
  const headers: Record<string, string> = { 'Accept': 'application/vnd.github.v3+json' };
  if (token) headers['Authorization'] = `token ${token}`;
  for (const [domain, queries] of Object.entries(GITHUB_QUERIES)) {
    for (const query of queries) {
      try {
        const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=updated&order=desc&per_page=3`;
        const resp = await fetch(url, { headers });
        const data = await resp.json();
        for (const repo of (data.items || [])) {
          papers.push({ domain_slug: domain, title: `${repo.full_name}: ${(repo.description || '').slice(0, 200)}`, url: repo.html_url, source: 'github', authors: repo.owner?.login || '', abstract: `Stars: ${repo.stargazers_count}, Forks: ${repo.forks_count}, Language: ${repo.language || 'N/A'}. ${(repo.description || '')}`.slice(0, 2000), published_date: (repo.pushed_at || '').split('T')[0] });
        }
      } catch (e) { console.error(`GitHub ${domain}/${query}:`, e); }
      await new Promise(r => setTimeout(r, 300));
    }
  }
  return papers;
}

// ═══════════════════════════════════════════
// NASA APOD
// ═══════════════════════════════════════════
async function scrapeNasa() {
  const papers: any[] = [];
  try {
    const url = 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&count=5';
    const resp = await fetch(url);
    const data = await resp.json();
    for (const item of (Array.isArray(data) ? data : [])) {
      papers.push({ domain_slug: 'space', title: item.title || '', url: item.url || '', source: 'nasa', authors: item.copyright || 'NASA', abstract: (item.explanation || '').slice(0, 2000), published_date: item.date || '' });
    }
  } catch (e) { console.error('NASA:', e); }
  return papers;
}

// ═══════════════════════════════════════════
// Semantic Scholar (top CS/bio papers)
// ═══════════════════════════════════════════
const SEMSCHOLAR_FIELDS: Record<string, string[]> = {
  'ai-ml': ['artificial intelligence', 'deep learning', 'large language models'],
  'cell-bio': ['genomics', 'CRISPR gene editing'],
  'pharma': ['drug discovery', 'pharmacology'],
  'bioeng': ['protein engineering', 'synthetic biology'],
  'physics': ['quantum computing', 'particle physics'],
  'comp-math': ['combinatorics', 'number theory'],
  'pure-math': ['algebraic geometry', 'topology'],
};

async function scrapeSemanticScholar() {
  const papers: any[] = [];
  for (const [domain, queries] of Object.entries(SEMSCHOLAR_FIELDS)) {
    for (const query of queries) {
      try {
        const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&limit=3&sort=publicationDate:desc&fields=title,url,abstract,authors,publicationDate`;
        const resp = await fetch(url);
        const data = await resp.json();
        for (const p of (data.data || [])) {
          papers.push({
            domain_slug: domain,
            title: (p.title || '').slice(0, 500),
            url: p.url || `https://api.semanticscholar.org/paper/${p.paperId}`,
            source: 'semantic-scholar',
            authors: (p.authors || []).map((a: any) => a.name).join(', ').slice(0, 500),
            abstract: (p.abstract || '').slice(0, 2000),
            published_date: p.publicationDate || '',
          });
        }
      } catch (e) { console.error(`SemanticScholar ${domain}/${query}:`, e); }
      await new Promise(r => setTimeout(r, 500));
    }
  }
  return papers;
}

// ═══════════════════════════════════════════
// Nature / Science (via OpenAlex API - free, covers Nature, Science, Cell, etc.)
// ═══════════════════════════════════════════
const OPENALEX_SOURCES: Record<string, { venue: string; domain: string }[]> = {
  'nature': [
    { venue: 'S137773608', domain: 'cell-bio' },    // Nature
    { venue: 'S15468489', domain: 'physics' },       // Nature Physics
    { venue: 'S186955311', domain: 'chemistry' },    // Nature Chemistry
    { venue: 'S24807848', domain: 'ai-ml' },         // Nature Machine Intelligence
    { venue: 'S4210200081', domain: 'bioeng' },      // Nature Biomedical Engineering
  ],
  'science': [
    { venue: 'S3880285', domain: 'space' },          // Science
  ],
};

async function scrapeOpenAlex() {
  const papers: any[] = [];
  const allVenues = Object.values(OPENALEX_SOURCES).flat();
  
  for (const { venue, domain } of allVenues) {
    try {
      const url = `https://api.openalex.org/works?filter=primary_location.source.id:${venue}&sort=publication_date:desc&per_page=3&select=title,doi,publication_date,authorships,abstract_inverted_index`;
      const resp = await fetch(url, { headers: { 'User-Agent': 'BrainForge/1.0 (mailto:joiscode121@gmail.com)' } });
      const data = await resp.json();
      
      for (const work of (data.results || [])) {
        // Reconstruct abstract from inverted index
        let abstract = '';
        if (work.abstract_inverted_index) {
          const words: [string, number][] = [];
          for (const [word, positions] of Object.entries(work.abstract_inverted_index as Record<string, number[]>)) {
            for (const pos of positions) {
              words.push([word, pos]);
            }
          }
          words.sort((a, b) => a[1] - b[1]);
          abstract = words.map(w => w[0]).join(' ');
        }
        
        const authors = (work.authorships || []).map((a: any) => a.author?.display_name).filter(Boolean).join(', ');
        const doiUrl = work.doi ? `https://doi.org/${work.doi.replace('https://doi.org/', '')}` : '';
        
        if (work.title) {
          papers.push({
            domain_slug: domain,
            title: work.title.slice(0, 500),
            url: doiUrl || `https://openalex.org/works/${work.id}`,
            source: 'openalex',
            authors: authors.slice(0, 500),
            abstract: abstract.slice(0, 2000),
            published_date: work.publication_date || '',
          });
        }
      }
    } catch (e) { console.error(`OpenAlex ${venue}/${domain}:`, e); }
    await new Promise(r => setTimeout(r, 300));
  }
  return papers;
}

// ═══════════════════════════════════════════
// DevTo / HackerNews (tech blogs + discussions)
// ═══════════════════════════════════════════
async function scrapeDevTo() {
  const papers: any[] = [];
  const tags = [
    { tag: 'machinelearning', domain: 'ai-ml' },
    { tag: 'gpu', domain: 'gpu-chips' },
    { tag: 'database', domain: 'systems' },
    { tag: 'linux', domain: 'kernel-os' },
    { tag: 'algorithms', domain: 'coding' },
    { tag: 'math', domain: 'comp-math' },
  ];
  
  for (const { tag, domain } of tags) {
    try {
      const url = `https://dev.to/api/articles?tag=${tag}&top=1&per_page=3`;
      const resp = await fetch(url);
      const articles = await resp.json();
      for (const a of (Array.isArray(articles) ? articles : [])) {
        papers.push({
          domain_slug: domain,
          title: (a.title || '').slice(0, 500),
          url: a.url || '',
          source: 'devto',
          authors: a.user?.name || a.user?.username || '',
          abstract: (a.description || '').slice(0, 2000),
          published_date: (a.published_at || '').split('T')[0],
        });
      }
    } catch (e) { console.error(`DevTo ${tag}:`, e); }
    await new Promise(r => setTimeout(r, 200));
  }
  return papers;
}

// ═══════════════════════════════════════════
// Main Handler
// ═══════════════════════════════════════════
export async function GET(req: NextRequest) {
  // Verify cron secret
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.get('authorization');
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const [arxiv, pubmed, github, nasa, semscholar, openalex, devto] = await Promise.all([
      scrapeArxiv(), scrapePubmed(), scrapeGithub(), scrapeNasa(),
      scrapeSemanticScholar(), scrapeOpenAlex(), scrapeDevTo(),
    ]);

    const allPapers = [...arxiv, ...pubmed, ...github, ...nasa, ...semscholar, ...openalex, ...devto];

    // Deduplicate by URL
    const { data: existing } = await supabaseAdmin.from('papers').select('url');
    const urlSet = new Set((existing || []).map(p => p.url));
    const newPapers = allPapers.filter(p => p.url && !urlSet.has(p.url));

    let inserted = 0;
    for (let i = 0; i < newPapers.length; i += 50) {
      const batch = newPapers.slice(i, i + 50);
      const { error } = await supabaseAdmin.from('papers').insert(batch);
      if (!error) inserted += batch.length;
      else console.error(`Insert batch ${i}:`, error.message);
    }

    return NextResponse.json({
      success: true,
      scraped: allPapers.length,
      new: newPapers.length,
      inserted,
      sources: { arxiv: arxiv.length, pubmed: pubmed.length, github: github.length, nasa: nasa.length, semanticScholar: semscholar.length, openalex: openalex.length, devto: devto.length },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
