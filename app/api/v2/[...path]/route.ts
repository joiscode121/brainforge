export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

const API_BASE = process.env.BRAINFORGE_API_URL || 'http://127.0.0.1:3099';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const proxyUrl = `${API_BASE}${url.pathname}${url.search}`;
  try {
    const resp = await fetch(proxyUrl, { cache: 'no-store' });
    const data = await resp.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'API unavailable' }, { status: 503 });
  }
}
