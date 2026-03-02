export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const proxyUrl = `http://127.0.0.1:3099${url.pathname}${url.search}`;
  try {
    const resp = await fetch(proxyUrl, { cache: 'no-store' });
    const data = await resp.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'API unavailable' }, { status: 503 });
  }
}
