import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const presets = db.prepare('SELECT id, name, snapshot_json, created_at FROM theme_presets ORDER BY id DESC').all() as {
    id: number;
    name: string;
    snapshot_json: string;
    created_at: string;
  }[];
  return NextResponse.json(
    presets.map((preset) => ({
      id: preset.id,
      name: preset.name,
      created_at: preset.created_at,
      snapshot: JSON.parse(preset.snapshot_json),
    }))
  );
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, snapshot } = await request.json();
  if (!name?.trim() || !snapshot) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const db = getDb();
  const result = db
    .prepare('INSERT INTO theme_presets (name, snapshot_json) VALUES (?, ?)')
    .run(String(name).trim(), JSON.stringify(snapshot));

  const created = db.prepare('SELECT id, name, snapshot_json, created_at FROM theme_presets WHERE id = ?').get(result.lastInsertRowid) as { id: number; name: string; snapshot_json: string; created_at: string };
  return NextResponse.json({ ...created, snapshot: JSON.parse(created.snapshot_json) }, { status: 201 });
}
