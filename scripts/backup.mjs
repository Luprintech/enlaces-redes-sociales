import fs from 'fs';
import path from 'path';

const root = process.cwd();
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupDir = path.join(root, 'backups', timestamp);
const dbSource = path.join(root, 'data', 'app.db');
const uploadsSource = path.join(root, 'public', 'uploads');

fs.mkdirSync(backupDir, { recursive: true });

if (fs.existsSync(dbSource)) {
  fs.copyFileSync(dbSource, path.join(backupDir, 'app.db'));
}

if (fs.existsSync(uploadsSource)) {
  fs.cpSync(uploadsSource, path.join(backupDir, 'uploads'), { recursive: true });
}

console.log(`Backup created at ${backupDir}`);
