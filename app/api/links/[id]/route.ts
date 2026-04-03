import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { auth } from '@/lib/auth';
import { normalizeHttpUrl, normalizeMediaUrl } from '@/lib/security';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const {
    title,
    url,
    description,
    category,
    thumbnail_url,
    icon,
    is_active,
    is_featured,
    sort_order,
    badge,
    custom_color,
    size,
    show_label,
    btn_style,
    start_at,
    end_at,
  } = body;

  const normalizedUrl = normalizeHttpUrl(url);
  const normalizedThumbnailUrl = normalizeMediaUrl(thumbnail_url);

  if (!title?.trim() || !normalizedUrl) {
    return NextResponse.json({ error: 'Invalid title or URL' }, { status: 400 });
  }

  const db = getDb();
  db.prepare(`
    UPDATE links SET
      title        = ?,
      url          = ?,
      description  = ?,
      category     = ?,
      thumbnail_url = ?,
      icon         = ?,
      is_active    = ?,
      is_featured  = ?,
      sort_order   = ?,
      badge        = ?,
      custom_color = ?,
      size         = ?,
      show_label   = ?,
      btn_style    = ?,
      start_at     = ?,
      end_at       = ?
    WHERE id = ?
  `).run(
    String(title).trim(),
    normalizedUrl,
    description ?? '',
    category ?? '',
    normalizedThumbnailUrl,
    icon ?? '',
    is_active ? 1 : 0,
    is_featured ? 1 : 0,
    sort_order ?? 0,
    badge ?? '',
    custom_color ?? '',
    size ?? 'md',
    show_label ? 1 : 0,
    btn_style ?? 'circle',
    start_at ?? '',
    end_at ?? '',
    id,
  );

  const updated = db.prepare('SELECT * FROM links WHERE id = ?').get(id);
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const db = getDb();
  db.prepare('DELETE FROM links WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}
