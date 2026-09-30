const express = require('express');
const path = require('path');
const SongModel = require('./schema'); // Import Model SQLite

const app = express();

// Configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Helper Fungsi Slug Generator
function createSlug(title, artist) {
  const raw = `${title}-${artist}`;
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// --- ROUTES ---

// Halaman Utama: List Semua Chord
app.get('/', (req, res) => {
  const songs = SongModel.getAll();
  res.render('index', { songs });
});

// Halaman Admin: Form Input
app.get('/admin', (req, res) => {
  res.render('admin');
});

// Admin Post Action
app.post('/admin/add', (req, res) => {
  const { title, artist, content } = req.body;
  const slug = createSlug(title, artist);

  try {
    SongModel.create({ title, artist, slug, content });
    res.redirect('/');
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(400).send('Lagu dengan judul dan artis yang sama sudah ada.');
    } else {
      res.status(500).send('Terjadi kesalahan server.');
    }
  }
});

// Halaman Detail Chord
app.get('/chord/:slug', (req, res) => {
  const song = SongModel.getBySlug(req.params.slug);
  if (!song) {
    return res.status(404).send('Lagu tidak ditemukan');
  }
  res.render('detail', { song });
});

app.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});
