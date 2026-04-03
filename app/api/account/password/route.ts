import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { getClientIp, rateLimiter } from '@/lib/security';

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.name) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ip = getClientIp(request.headers);
  const limit = rateLimiter.check(`password:${ip}:${session.user.name}`, 5, 15 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json({ error: 'Too many attempts' }, { status: 429 });
  }

  const { currentPassword, newPassword } = await request.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  if (String(newPassword).length < 8) {
    return NextResponse.json({ error: 'Password too short' }, { status: 400 });
  }

  const db = getDb();
  const user = db
    .prepare('SELECT id, username, password_hash FROM users WHERE username = ?')
    .get(session.user.name) as
    | { id: number; username: string; password_hash: string }
    | undefined;

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const matches = await bcrypt.compare(currentPassword, user.password_hash);
  if (!matches) {
    return NextResponse.json({ error: 'Current password invalid' }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(passwordHash, user.id);
  rateLimiter.reset(`password:${ip}:${session.user.name}`);

  return NextResponse.json({ success: true });
}
