import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { connectDB, isDBConnected } from './config/db.js';
import { repo } from './store/index.js';
import postsRouter from './routes/posts.js';
import authRouter from './routes/auth.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

async function ensureAdmin() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) {
    console.log('Admin not configured — set ADMIN_USERNAME and ADMIN_PASSWORD in .env to enable uploads');
    return;
  }
  const existing = await repo.findByUsername(username);
  if (existing) return;
  const email = process.env.ADMIN_EMAIL || `${username}@admin.local`;
  await repo.createUser({ username, email, password, role: 'admin' });
  console.log(`Admin account ready: ${username}`);
}

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, db: isDBConnected() ? 'mongo' : 'memory' });
});

app.use('/api/posts', postsRouter);
app.use('/api/auth', authRouter);

app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB(process.env.MONGO_URI);
  await ensureAdmin();
  const server = app.listen(PORT, () => {
    console.log(`Anime Portfolio API running on http://localhost:${PORT}`);
    console.log(`Storage: ${isDBConnected() ? 'MongoDB' : 'in-memory (MONGO_URI not set)'}`);
  });
  server.on('error', (err) => {
    console.error('Server failed to start:', err.message);
    process.exit(1);
  });
}

start();
