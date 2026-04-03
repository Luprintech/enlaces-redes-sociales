import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { auth } from '@/lib/auth';
import { normalizeHttpUrl, normalizeMediaUrl } from '@/lib/security';

export async function GET() {
  const db = getDb();
  const links = db.prepare('SELECT * FROM links ORDER BY sort_order ASC, id ASC').all();
  return NextResponse.json(links);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const {
    title,
    url,
    icon,
    type,
    description,
    category,
    thumbnail_url,
    is_featured,
    badge,
    custom_color,
    size,
    show_label,
    btn_style,
    start_at,
    end_at,
  } = body;

  const linkType = type === 'social' ? 'social' : 'link';
  const normalizedUrl = normalizeHttpUrl(url);
  const normalizedThumbnailUrl = normalizeMediaUrl(thumbnail_url);

  if (!title?.trim() || !normalizedUrl) {
    return NextResponse.json({ error: 'Invalid title or URL' }, { status: 400 });
  }

  const db = getDb();
  const maxOrder = (
    db.prepare('SELECT MAX(sort_order) as max FROM links WHERE type = ?').get(linkType) as {
      max: number | null;
    }
  ).max ?? -1;

  const result = db
    .prepare(`
      INSERT INTO links (
        title, url, description, category, thumbnail_url, icon, type, sort_order,
        is_featured, badge, custom_color, size, show_label, btn_style, start_at, end_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      String(title).trim(),
      normalizedUrl,
      description ?? '',
      category ?? '',
      normalizedThumbnailUrl,
      icon ?? '',
      linkType,
      maxOrder + 1,
      is_featured ? 1 : 0,
      badge ?? '',
      custom_color ?? '',
      size ?? 'md',
      show_label ? 1 : 0,
      btn_style ?? 'circle',
      start_at ?? '',
      end_at ?? '',
    );

  const created = db.prepare('SELECT * FROM links WHERE id = ?').get(result.lastInsertRowid);
  return NextResponse.json(created, { status: 201 });
}
