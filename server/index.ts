import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import express, { type NextFunction, type Request, type Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';
import { fileURLToPath } from 'url';
import { getDb } from '../lib/db.js';
import {
  getClientIp,
  normalizeHttpUrl,
  normalizeMediaUrl,
  rateLimiter,
  validateImageUpload,
} from '../lib/security.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const uploadsDir = path.join(publicDir, 'uploads');
const distDir = path.join(rootDir, 'dist');

fs.mkdirSync(uploadsDir, { recursive: true });

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const db = getDb();
const PORT = Number(process.env.PORT || 4000);
const SESSION_COOKIE = 'sid';
const SESSION_DAYS = 30;

app.set('trust proxy', 1);
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser(process.env.SESSION_SECRET || 'dev-secret'));
app.use('/uploads', express.static(uploadsDir));

type UserRecord = { id: number; username: string; password_hash: string };

function createSession(userId: number) {
  const id = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  db.prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)').run(id, userId, expiresAt);
  return { id, expiresAt };
}

function getSessionUser(sessionId?: string) {
  if (!sessionId) return null;
  const row = db.prepare(`
    SELECT sessions.id, sessions.expires_at, users.id as user_id, users.username
    FROM sessions
    JOIN users ON users.id = sessions.user_id
    WHERE sessions.id = ?
  `).get(sessionId) as { id: string; expires_at: string; user_id: number; username: string } | undefined;

  if (!row) return null;
  if (Date.parse(row.expires_at) < Date.now()) {
    db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
    return null;
  }

  return { id: row.id, user: { id: row.user_id, username: row.username } };
}

function authRequired(req: Request, res: Response, next: NextFunction) {
  const session = getSessionUser(req.cookies?.[SESSION_COOKIE]);
  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  (req as Request & { sessionUser?: { id: number; username: string } }).sessionUser = session.user;
  next();
}

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body ?? {};
  const ip = getClientIp(req.headers as unknown as Record<string, string>);
  const limit = rateLimiter.check(`login:${ip}:${username}`, 6, 15 * 60 * 1000);
  if (!limit.allowed) {
    res.status(429).json({ error: 'Too many attempts' });
    return;
  }

  const user = db.prepare('SELECT id, username, password_hash FROM users WHERE username = ?').get(username) as UserRecord | undefined;
  if (!user || !(await bcrypt.compare(String(password || ''), user.password_hash))) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  rateLimiter.reset(`login:${ip}:${username}`);
  const session = createSession(user.id);
  res.cookie(SESSION_COOKIE, session.id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(session.expiresAt),
  });

  res.json({ success: true, user: { id: user.id, username: user.username } });
});

app.post('/api/auth/logout', (req, res) => {
  const sessionId = req.cookies?.[SESSION_COOKIE];
  if (sessionId) {
    db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
  }
  res.clearCookie(SESSION_COOKIE);
  res.json({ success: true });
});

app.get('/api/auth/session', (req, res) => {
  const session = getSessionUser(req.cookies?.[SESSION_COOKIE]);
  if (!session) {
    res.json({ authenticated: false, user: null });
    return;
  }
  res.json({ authenticated: true, user: session.user });
});

app.put('/api/account/password', authRequired, async (req, res) => {
  const currentPassword = String(req.body?.currentPassword || '');
  const newPassword = String(req.body?.newPassword || '');
  const user = (req as Request & { sessionUser?: { id: number; username: string } }).sessionUser!;
  const ip = getClientIp(req.headers as unknown as Record<string, string>);
  const limit = rateLimiter.check(`password:${ip}:${user.username}`, 5, 15 * 60 * 1000);
  if (!limit.allowed) {
    res.status(429).json({ error: 'Too many attempts' });
    return;
  }

  if (newPassword.length < 8) {
    res.status(400).json({ error: 'Password too short' });
    return;
  }

  const userRecord = db.prepare('SELECT id, username, password_hash FROM users WHERE id = ?').get(user.id) as UserRecord | undefined;
  if (!userRecord || !(await bcrypt.compare(currentPassword, userRecord.password_hash))) {
    res.status(400).json({ error: 'Current password invalid' });
    return;
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(passwordHash, user.id);
  rateLimiter.reset(`password:${ip}:${user.username}`);
  res.json({ success: true });
});

app.get('/api/profile', (_req, res) => {
  const profile = db.prepare('SELECT * FROM profile WHERE id = 1').get();
  res.json(profile);
});

app.put('/api/profile', authRequired, (req, res) => {
  const body = req.body ?? {};
  const normalizedCtaUrl = body.cta_url ? normalizeHttpUrl(body.cta_url) : '';
  const normalizedContactUrl = body.contact_url ? normalizeHttpUrl(body.contact_url) : '';
  if (body.cta_url && !normalizedCtaUrl) return res.status(400).json({ error: 'Invalid CTA URL' });
  if (body.contact_url && !normalizedContactUrl) return res.status(400).json({ error: 'Invalid contact URL' });

  db.prepare(`
    UPDATE profile SET
      name = ?, bio = ?, image_url = ?, background_image_url = ?, background_image_opacity = ?,
      background_gradient_opacity = ?, background_gradient_style = ?, welcome_text = ?, primary_color = ?,
      secondary_color = ?, bg_color = ?, card_color = ?, cta_title = ?, cta_url = ?, cta_description = ?,
      contact_label = ?, contact_url = ?, contact_icon = ?, proof_line_1 = ?, proof_line_2 = ?,
      ga_measurement_id = ?, meta_pixel_id = ?, updated_at = datetime('now')
    WHERE id = 1
  `).run(
    body.name,
    body.bio,
    normalizeMediaUrl(body.image_url),
    normalizeMediaUrl(body.background_image_url),
    body.background_image_opacity ?? 0.28,
    body.background_gradient_opacity ?? 1,
    body.background_gradient_style ?? 'aurora',
    body.welcome_text ?? '',
    body.primary_color,
    body.secondary_color,
    body.bg_color,
    body.card_color,
    body.cta_title ?? '',
    normalizedCtaUrl ?? '',
    body.cta_description ?? '',
    body.contact_label ?? '',
    normalizedContactUrl ?? '',
    body.contact_icon ?? 'website',
    body.proof_line_1 ?? '',
    body.proof_line_2 ?? '',
    body.ga_measurement_id ?? '',
    body.meta_pixel_id ?? '',
  );

  res.json(db.prepare('SELECT * FROM profile WHERE id = 1').get());
});

app.get('/api/links', (_req, res) => {
  res.json(db.prepare('SELECT * FROM links ORDER BY sort_order ASC, id ASC').all());
});

app.post('/api/links', authRequired, (req, res) => {
  const body = req.body ?? {};
  const linkType = body.type === 'social' ? 'social' : 'link';
  const normalizedUrl = normalizeHttpUrl(body.url);
  const normalizedThumbnailUrl = normalizeMediaUrl(body.thumbnail_url);
  if (!body.title?.trim() || !normalizedUrl) return res.status(400).json({ error: 'Invalid title or URL' });
  const maxOrder = (db.prepare('SELECT MAX(sort_order) as max FROM links WHERE type = ?').get(linkType) as { max: number | null }).max ?? -1;
  const result = db.prepare(`
    INSERT INTO links (
      title, url, description, category, thumbnail_url, icon, type, sort_order,
      is_featured, badge, custom_color, size, show_label, btn_style, start_at, end_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    String(body.title).trim(),
    normalizedUrl,
    body.description ?? '',
    body.category ?? '',
    normalizedThumbnailUrl,
    body.icon ?? '',
    linkType,
    maxOrder + 1,
    body.is_featured ? 1 : 0,
    body.badge ?? '',
    body.custom_color ?? '',
    body.size ?? 'md',
    body.show_label ? 1 : 0,
    body.btn_style ?? 'circle',
    body.start_at ?? '',
    body.end_at ?? '',
  );
  res.status(201).json(db.prepare('SELECT * FROM links WHERE id = ?').get(result.lastInsertRowid));
});

app.put('/api/links/:id', authRequired, (req, res) => {
  const body = req.body ?? {};
  const normalizedUrl = normalizeHttpUrl(body.url);
  const normalizedThumbnailUrl = normalizeMediaUrl(body.thumbnail_url);
  if (!body.title?.trim() || !normalizedUrl) return res.status(400).json({ error: 'Invalid title or URL' });
  db.prepare(`
    UPDATE links SET
      title = ?, url = ?, description = ?, category = ?, thumbnail_url = ?, icon = ?, is_active = ?,
      is_featured = ?, sort_order = ?, badge = ?, custom_color = ?, size = ?, show_label = ?, btn_style = ?,
      start_at = ?, end_at = ?
    WHERE id = ?
  `).run(
    String(body.title).trim(), normalizedUrl, body.description ?? '', body.category ?? '', normalizedThumbnailUrl,
    body.icon ?? '', body.is_active ? 1 : 0, body.is_featured ? 1 : 0, body.sort_order ?? 0,
    body.badge ?? '', body.custom_color ?? '', body.size ?? 'md', body.show_label ? 1 : 0,
    body.btn_style ?? 'circle', body.start_at ?? '', body.end_at ?? '', req.params.id
  );
  res.json(db.prepare('SELECT * FROM links WHERE id = ?').get(req.params.id));
});

app.delete('/api/links/:id', authRequired, (req, res) => {
  db.prepare('DELETE FROM links WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.post('/api/upload', authRequired, upload.single('file'), (req, res) => {
  const file = req.file;
  const validation = validateImageUpload({
    bytes: file?.buffer ? new Uint8Array(file.buffer) : null,
    byteLength: file?.size ?? 0,
  });
  if (!validation.ok) return res.status(400).json({ error: validation.error });
  const ext = 'ext' in validation ? validation.ext : 'bin';
  const filename = `upload-${Date.now()}.${ext}`;
  fs.writeFileSync(path.join(uploadsDir, filename), file!.buffer);
  res.json({ url: `/uploads/${filename}` });
});

app.get('/api/theme-presets', authRequired, (_req, res) => {
  const presets = db.prepare('SELECT id, name, snapshot_json, created_at FROM theme_presets ORDER BY id DESC').all() as { id: number; name: string; snapshot_json: string; created_at: string }[];
  res.json(presets.map((preset) => ({ id: preset.id, name: preset.name, created_at: preset.created_at, snapshot: JSON.parse(preset.snapshot_json) })));
});

app.post('/api/theme-presets', authRequired, (req, res) => {
  const { name, snapshot } = req.body ?? {};
  if (!name?.trim() || !snapshot) return res.status(400).json({ error: 'Missing fields' });
  const result = db.prepare('INSERT INTO theme_presets (name, snapshot_json) VALUES (?, ?)').run(String(name).trim(), JSON.stringify(snapshot));
  const created = db.prepare('SELECT id, name, snapshot_json, created_at FROM theme_presets WHERE id = ?').get(result.lastInsertRowid) as { id: number; name: string; snapshot_json: string; created_at: string };
  res.status(201).json({ id: created.id, name: created.name, created_at: created.created_at, snapshot: JSON.parse(created.snapshot_json) });
});

app.delete('/api/theme-presets/:id', authRequired, (req, res) => {
  db.prepare('DELETE FROM theme_presets WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.get('/out/:id', (req, res) => {
  const link = db.prepare('SELECT id, url FROM links WHERE id = ? AND is_active = 1').get(req.params.id) as { id: number; url: string } | undefined;
  if (!link) {
    res.redirect('/');
    return;
  }
  db.prepare('UPDATE links SET clicks = clicks + 1 WHERE id = ?').run(req.params.id);
  res.redirect(link.url);
});

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/') || req.path.startsWith('/out/')) {
      next();
      return;
    }
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
