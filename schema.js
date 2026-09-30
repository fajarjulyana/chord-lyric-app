const Database = require('better-sqlite3');
const path = require('path');

// Inisialisasi koneksi SQLite
const db = new Database(path.join(__dirname, 'database.db'));

// Optimasi performa SQLite dengan WAL Mode (Write-Ahead Logging)
db.pragma('journal_mode = WAL');

// 1. Inisialisasi Schema Tabel
function initDatabase() {
  const query = `
    CREATE TABLE IF NOT EXISTS songs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      artist TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_songs_slug ON songs(slug);
  `;
  db.exec(query);
}

// Jalankan auto-create tabel saat file di-require
initDatabase();

// 2. Query Helper Functions
const SongModel = {
  // Ambil semua lagu untuk halaman utama
  getAll: () => {
    const stmt = db.prepare('SELECT id, title, artist, slug FROM songs ORDER BY title ASC');
    return stmt.all();
  },

  // Ambil detail 1 lagu berdasarkan slug
  getBySlug: (slug) => {
    const stmt = db.prepare('SELECT * FROM songs WHERE slug = ?');
    return stmt.get(slug);
  },

  // Insert lagu baru dari form admin
  create: ({ title, artist, slug, content }) => {
    const stmt = db.prepare(`
      INSERT INTO songs (title, artist, slug, content)
      VALUES (?, ?, ?, ?)
    `);
    return stmt.run(title, artist, slug, content);
  },

  // Hapus lagu (opsional untuk fitur admin)
  deleteById: (id) => {
    const stmt = db.prepare('DELETE FROM songs WHERE id = ?');
    return stmt.run(id);
  }
};

module.exports = SongModel;
