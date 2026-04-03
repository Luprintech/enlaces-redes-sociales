import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const link = db.prepare('SELECT id, url FROM links WHERE id = ? AND is_active = 1').get(id) as
    | { id: number; url: string }
    | undefined;

  if (!link) {
    return NextResponse.redirect(new URL('/', process.env.NEXTAUTH_URL ?? 'http://localhost:3000'));
  }

  db.prepare('UPDATE links SET clicks = clicks + 1 WHERE id = ?').run(id);
  return NextResponse.redirect(link.url);
}
