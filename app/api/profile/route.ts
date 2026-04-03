import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { auth } from '@/lib/auth';
import { normalizeHttpUrl, normalizeMediaUrl } from '@/lib/security';

export async function GET() {
  const db = getDb();
  const profile = db.prepare('SELECT * FROM profile WHERE id = 1').get();
  return NextResponse.json(profile);
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const {
    name,
    bio,
    image_url,
    background_image_url,
    background_image_opacity,
    background_gradient_opacity,
    background_gradient_style,
    welcome_text,
    primary_color,
    secondary_color,
    bg_color,
    card_color,
    cta_title,
    cta_url,
    cta_description,
    contact_label,
    contact_url,
    contact_icon,
    proof_line_1,
    proof_line_2,
    ga_measurement_id,
    meta_pixel_id,
  } = body;

  const normalizedCtaUrl = cta_url ? normalizeHttpUrl(cta_url) : '';
  const normalizedContactUrl = contact_url ? normalizeHttpUrl(contact_url) : '';

  if (cta_url && !normalizedCtaUrl) {
    return NextResponse.json({ error: 'Invalid CTA URL' }, { status: 400 });
  }

  if (contact_url && !normalizedContactUrl) {
    return NextResponse.json({ error: 'Invalid contact URL' }, { status: 400 });
  }

  const db = getDb();
  db.prepare(`
    UPDATE profile SET
      name = ?,
      bio = ?,
      image_url = ?,
      background_image_url = ?,
      background_image_opacity = ?,
      background_gradient_opacity = ?,
      background_gradient_style = ?,
      welcome_text = ?,
      primary_color = ?,
      secondary_color = ?,
      bg_color = ?,
      card_color = ?,
      cta_title = ?,
      cta_url = ?,
      cta_description = ?,
      contact_label = ?,
      contact_url = ?,
      contact_icon = ?,
      proof_line_1 = ?,
      proof_line_2 = ?,
      ga_measurement_id = ?,
      meta_pixel_id = ?,
      updated_at = datetime('now')
    WHERE id = 1
  `).run(
    name,
    bio,
    normalizeMediaUrl(image_url),
    normalizeMediaUrl(background_image_url),
    background_image_opacity ?? 0.28,
    background_gradient_opacity ?? 1,
    background_gradient_style ?? 'aurora',
    welcome_text ?? '',
    primary_color,
    secondary_color,
    bg_color,
    card_color,
    cta_title ?? '',
    normalizedCtaUrl ?? '',
    cta_description ?? '',
    contact_label ?? '',
    normalizedContactUrl ?? '',
    contact_icon ?? 'website',
    proof_line_1 ?? '',
    proof_line_2 ?? '',
    ga_measurement_id ?? '',
    meta_pixel_id ?? '',
  );

  const updated = db.prepare('SELECT * FROM profile WHERE id = 1').get();
  return NextResponse.json(updated);
}
