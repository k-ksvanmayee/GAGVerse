import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { repo } from '../store/index.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function sign(user) {
  const id = user.id || String(user._id);
  return jwt.sign({ id, role: user.role || 'user' }, JWT_SECRET, { expiresIn: '7d' });
}

function publicUser(user) {
  return {
    id: user.id || String(user._id),
    username: user.username,
    email: user.email,
    role: user.role || 'user',
  };
}

router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body || {};
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    const existing = await repo.findUser(username, email);
    if (existing) {
      return res.status(409).json({ message: 'Username or email already in use' });
    }
    const user = await repo.createUser({
      username: String(username).trim(),
      email: String(email).trim().toLowerCase(),
      password,
    });
    res.status(201).json({ token: sign(user), user });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ message: 'Missing credentials' });
    }
    const user = await repo.findByUsername(username);
    if (!user || !(await user.checkPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ token: sign(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

router.get('/me', authRequired, async (req, res, next) => {
  try {
    const user = await repo.findUserById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});

export default router;
