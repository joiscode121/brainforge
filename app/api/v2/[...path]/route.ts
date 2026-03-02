export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

const API_BASE = process.env.BRAINFORGE_API_URL || 'http://127.0.0.1:3099';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const proxyUrl = `${API_BASE}${url.pathname}${url.search}`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const resp = await fetch(proxyUrl, { cache: 'no-store', signal: controller.signal });
    clearTimeout(timeout);
    const data = await resp.json();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ 
      error: 'API unavailable', 
      detail: e?.message || 'unknown',
      apiBase: API_BASE,
      url: proxyUrl 
    }, { status: 503 });
  }
}
