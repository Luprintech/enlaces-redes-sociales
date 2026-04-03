import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'app.db');

const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    initSchema(db);
  }
  return db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      name TEXT NOT NULL DEFAULT 'Mi Nombre',
      bio TEXT DEFAULT '',
      image_url TEXT DEFAULT '',
      background_image_url TEXT DEFAULT '',
      background_image_opacity REAL DEFAULT 0.28,
      background_gradient_opacity REAL DEFAULT 1,
      background_gradient_style TEXT DEFAULT 'aurora',
      welcome_text TEXT DEFAULT '',
      primary_color TEXT DEFAULT '#EC4899',
      secondary_color TEXT DEFAULT '#2563EB',
      bg_color TEXT DEFAULT '#0D0D1F',
      card_color TEXT DEFAULT '#1A1040',
      cta_title TEXT DEFAULT '',
      cta_url TEXT DEFAULT '',
      cta_description TEXT DEFAULT '',
      contact_label TEXT DEFAULT 'Escribime',
      contact_url TEXT DEFAULT '',
      contact_icon TEXT DEFAULT 'website',
      proof_line_1 TEXT DEFAULT '',
      proof_line_2 TEXT DEFAULT '',
      ga_measurement_id TEXT DEFAULT '',
      meta_pixel_id TEXT DEFAULT '',
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      description TEXT DEFAULT '',
      category TEXT DEFAULT '',
      thumbnail_url TEXT DEFAULT '',
      icon TEXT DEFAULT '',
      type TEXT DEFAULT 'link',
      is_active INTEGER DEFAULT 1,
      is_featured INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      clicks INTEGER DEFAULT 0,
      badge TEXT DEFAULT '',
      custom_color TEXT DEFAULT '',
      size TEXT DEFAULT 'md',
      show_label INTEGER DEFAULT 0,
      btn_style TEXT DEFAULT 'circle',
      start_at TEXT DEFAULT '',
      end_at TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS theme_presets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      snapshot_json TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  const profileCols = (db.prepare('PRAGMA table_info(profile)').all() as { name: string }[]).map((c) => c.name);
  const profileMigrations: [string, string][] = [
    ['welcome_text', "ALTER TABLE profile ADD COLUMN welcome_text TEXT DEFAULT ''"],
    ['background_image_url', "ALTER TABLE profile ADD COLUMN background_image_url TEXT DEFAULT ''"],
    ['background_image_opacity', "ALTER TABLE profile ADD COLUMN background_image_opacity REAL DEFAULT 0.28"],
    ['background_gradient_opacity', "ALTER TABLE profile ADD COLUMN background_gradient_opacity REAL DEFAULT 1"],
    ['background_gradient_style', "ALTER TABLE profile ADD COLUMN background_gradient_style TEXT DEFAULT 'aurora'"],
    ['cta_title', "ALTER TABLE profile ADD COLUMN cta_title TEXT DEFAULT ''"],
    ['cta_url', "ALTER TABLE profile ADD COLUMN cta_url TEXT DEFAULT ''"],
    ['cta_description', "ALTER TABLE profile ADD COLUMN cta_description TEXT DEFAULT ''"],
    ['contact_label', "ALTER TABLE profile ADD COLUMN contact_label TEXT DEFAULT 'Escribime'"],
    ['contact_url', "ALTER TABLE profile ADD COLUMN contact_url TEXT DEFAULT ''"],
    ['contact_icon', "ALTER TABLE profile ADD COLUMN contact_icon TEXT DEFAULT 'website'"],
    ['proof_line_1', "ALTER TABLE profile ADD COLUMN proof_line_1 TEXT DEFAULT ''"],
    ['proof_line_2', "ALTER TABLE profile ADD COLUMN proof_line_2 TEXT DEFAULT ''"],
    ['ga_measurement_id', "ALTER TABLE profile ADD COLUMN ga_measurement_id TEXT DEFAULT ''"],
    ['meta_pixel_id', "ALTER TABLE profile ADD COLUMN meta_pixel_id TEXT DEFAULT ''"],
  ];
  for (const [col, sql] of profileMigrations) {
    if (!profileCols.includes(col)) db.exec(sql);
  }

  const linkCols = (db.prepare('PRAGMA table_info(links)').all() as { name: string }[]).map((c) => c.name);
  const linkMigrations: [string, string][] = [
    ['type', "ALTER TABLE links ADD COLUMN type TEXT DEFAULT 'link'"],
    ['description', "ALTER TABLE links ADD COLUMN description TEXT DEFAULT ''"],
    ['category', "ALTER TABLE links ADD COLUMN category TEXT DEFAULT ''"],
    ['thumbnail_url', "ALTER TABLE links ADD COLUMN thumbnail_url TEXT DEFAULT ''"],
    ['is_featured', "ALTER TABLE links ADD COLUMN is_featured INTEGER DEFAULT 0"],
    ['clicks', "ALTER TABLE links ADD COLUMN clicks INTEGER DEFAULT 0"],
    ['badge', "ALTER TABLE links ADD COLUMN badge TEXT DEFAULT ''"],
    ['custom_color', "ALTER TABLE links ADD COLUMN custom_color TEXT DEFAULT ''"],
    ['size', "ALTER TABLE links ADD COLUMN size TEXT DEFAULT 'md'"],
    ['show_label', "ALTER TABLE links ADD COLUMN show_label INTEGER DEFAULT 0"],
    ['btn_style', "ALTER TABLE links ADD COLUMN btn_style TEXT DEFAULT 'circle'"],
    ['start_at', "ALTER TABLE links ADD COLUMN start_at TEXT DEFAULT ''"],
    ['end_at', "ALTER TABLE links ADD COLUMN end_at TEXT DEFAULT ''"],
  ];
  for (const [col, sql] of linkMigrations) {
    if (!linkCols.includes(col)) db.exec(sql);
  }

  const profile = db.prepare('SELECT id FROM profile WHERE id = 1').get();
  if (!profile) {
    db.prepare(`
      INSERT INTO profile (
        id, name, bio, image_url, welcome_text, primary_color, secondary_color, bg_color, card_color,
        background_image_url, background_image_opacity, background_gradient_opacity, background_gradient_style,
        cta_title, cta_url, cta_description, contact_label, contact_url, contact_icon, proof_line_1, proof_line_2
      ) VALUES (
        1, 'Tu Nombre', 'Descripcion breve', '', 'Llegaste desde mis redes. Aca tenes todo ordenado para que encuentres lo importante.',
        '#EC4899', '#2563EB', '#0D0D1F', '#1A1040',
        '', 0.28, 1, 'aurora',
        'Empeza por aca', '', 'Mi enlace principal para convertir seguidores en clientes.',
        'Contactame', '', 'website', 'Mas de 100 proyectos publicados', 'Comunidad activa en todas mis redes'
      )
    `).run();
  }

  const socialsCount = (db.prepare("SELECT COUNT(*) as count FROM links WHERE type = 'social'").get() as { count: number }).count;
  if (socialsCount === 0) {
    const ins = db.prepare(`
      INSERT INTO links (title, url, icon, type, sort_order, show_label)
      VALUES (?, ?, ?, 'social', ?, ?)
    `);
    ins.run('Instagram', 'https://instagram.com', 'instagram', 0, 0);
    ins.run('YouTube', 'https://youtube.com', 'youtube', 1, 0);
    ins.run('Twitter / X', 'https://x.com', 'twitter', 2, 0);
  }

  const linksCount = (db.prepare("SELECT COUNT(*) as count FROM links WHERE type = 'link'").get() as { count: number }).count;
  if (linksCount === 0) {
    const ins = db.prepare(`
      INSERT INTO links (title, url, description, category, icon, type, sort_order, is_featured)
      VALUES (?, ?, ?, ?, ?, 'link', ?, ?)
    `);
    ins.run('Mi ultimo video', 'https://youtube.com', 'El contenido mas reciente para arrancar rapido.', 'Contenido', 'youtube', 0, 1);
    ins.run('Mi portfolio', 'https://example.com', 'Trabajos, servicios y casos reales.', 'Servicios', 'website', 1, 0);
  }

  const usersCount = (db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }).count;
  if (usersCount === 0) {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'changeme123';
    const passwordHash = bcrypt.hashSync(password, 10);
    db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run(username, passwordHash);
  }
}
