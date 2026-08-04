import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(10 + (n % 8), (n * 13) % 60, 0, 0);
  return d;
}

function comment(name, text, n) {
  return { id: randomUUID(), name, text, createdAt: daysAgo(n) };
}

const seedPosts = [
  {
    title: 'Blade of the Crimson Sky',
    description:
      'A lone swordsman carves a path through a burning battlefield, every strike painting the sky in hues of red. Motion, fury, and a promise whispered to the wind.',
    image: '/images/anime1.jpg',
    category: 'Action',
    tags: ['swords', 'battle', 'determination'],
    likedBy: ['demo-a', 'demo-b', 'demo-c', 'demo-d', 'demo-e', 'demo-f', 'demo-g'],
    comments: [
      comment('Rin', 'The composition is breathtaking, the energy jumps right off the screen.', 1),
      comment('Kaz', 'That silhouette work is insanely clean. Peak action art.', 0),
    ],
    createdAt: daysAgo(11),
  },
  {
    title: 'Neon Sakura Nights',
    description:
      'Two figures meet under a canopy of cherry blossoms bathed in electric neon. A city that never sleeps watches over a quiet confession.',
    image: '/images/anime2.jpg',
    category: 'Romance',
    tags: ['sakura', 'neon', 'city'],
    likedBy: ['demo-a', 'demo-b', 'demo-c', 'demo-d', 'demo-e'],
    comments: [
      comment('Hana', 'The warm pinks against the cool neon give me chills. So romantic.', 3),
    ],
    createdAt: daysAgo(10),
  },
  {
    title: 'Echoes of the Astral Sea',
    description:
      'A spellcaster summons constellations from a forgotten ocean of stars, weaving them into a gate that hums with ancient magic.',
    image: '/images/anime3.jpg',
    category: 'Fantasy',
    tags: ['magic', 'stars', 'spellcaster'],
    likedBy: ['demo-a', 'demo-c', 'demo-e', 'demo-f'],
    comments: [],
    createdAt: daysAgo(9),
  },
  {
    title: 'The Last Ember',
    description:
      'When the fire that once guarded the world finally dims, one girl refuses to let it die. She reaches for the last ember with bare hands.',
    image: '/images/anime4.jpg',
    category: 'Action',
    tags: ['fire', 'hope', 'guardian'],
    likedBy: ['demo-b', 'demo-d', 'demo-f', 'demo-g', 'demo-h'],
    comments: [
      comment('Sora', 'That orange glow is doing all the storytelling. Gorgeous.', 5),
      comment('Aki', 'Emotionally devastating in the best way.', 4),
    ],
    createdAt: daysAgo(8),
  },
  {
    title: 'Whispers of the Moonlit Garden',
    description:
      'A quiet afternoon under a crescent moon, where the flowers lean in to listen. Soft light, softer secrets, and tea that has gone cold twice.',
    image: '/images/anime5.jpg',
    category: 'Slice of Life',
    tags: ['garden', 'moon', 'quiet'],
    likedBy: ['demo-a', 'demo-b', 'demo-c'],
    comments: [],
    createdAt: daysAgo(7),
  },
  {
    title: 'Cosmic Drifters',
    description:
      'Hitching a ride on the tail of a comet, three drifters cross the void between dying stars, chasing a signal from a world they barely remember.',
    image: '/images/anime6.jpg',
    category: 'Sci-Fi',
    tags: ['space', 'comet', 'adventure'],
    likedBy: ['demo-c', 'demo-e', 'demo-f', 'demo-g'],
    comments: [
      comment('Nova', 'The palette is out of this world. Literally.', 2),
    ],
    createdAt: daysAgo(6),
  },
  {
    title: 'Crimson Requiem',
    description:
      'A kingdom sings its last song. A dancer performs on the eve of the fall, petals and ash swirling together in a waltz of goodbye.',
    image: '/images/anime7.jpg',
    category: 'Drama',
    tags: ['dancer', 'requiem', 'fall'],
    likedBy: ['demo-a', 'demo-d', 'demo-e', 'demo-h'],
    comments: [],
    createdAt: daysAgo(5),
  },
  {
    title: 'The Clockwork Alchemist',
    description:
      'In a tower of ticking gears and bubbling vials, an alchemist pieces together a memory from brass and starlight — and something answers.',
    image: '/images/anime8.jpg',
    category: 'Mystery',
    tags: ['steampunk', 'alchemy', 'mystery'],
    likedBy: ['demo-b', 'demo-c', 'demo-f'],
    comments: [
      comment('Gear', 'The mechanical details are absurdly good. Zoom in!', 6),
    ],
    createdAt: daysAgo(4),
  },
  {
    title: 'Velvet Thorns',
    description:
      'A rose that grows only at midnight, guarded by a knight who has forgotten why. Some beauties ask to be pricked.',
    image: '/images/anime9.jpg',
    category: 'Romance',
    tags: ['rose', 'knight', 'midnight'],
    likedBy: ['demo-a', 'demo-b', 'demo-d', 'demo-g', 'demo-h'],
    comments: [],
    createdAt: daysAgo(3),
  },
  {
    title: 'Thunder of the Golden Dawn',
    description:
      'Storm clouds part as the first light of dawn breaks, and a warrior stands silhouetted against gold — the calm before the final clash.',
    image: '/images/anime10.jpg',
    category: 'Action',
    tags: ['dawn', 'storm', 'warrior'],
    likedBy: ['demo-c', 'demo-e', 'demo-f'],
    comments: [
      comment('Raijin', 'Golden hour lighting on a battlefield. Chef kiss.', 1),
    ],
    createdAt: daysAgo(2),
  },
  {
    title: 'Tides of Azure',
    description:
      'A mermaid of the deep current drifts through an ocean of impossible blue, singing the tide into a slow, hypnotic rhythm.',
    image: '/images/anime11.jpg',
    category: 'Fantasy',
    tags: ['mermaid', 'ocean', 'song'],
    likedBy: ['demo-a', 'demo-b', 'demo-c', 'demo-d'],
    comments: [],
    createdAt: daysAgo(1),
  },
  {
    title: 'Midnight Parade',
    description:
      'Every full moon, the ghosts of the town’s fondest memories march down the main street. Tonight, for the first time, someone walks beside them.',
    image: '/images/anime12.jpg',
    category: 'Comedy',
    tags: ['festival', 'ghosts', 'parade'],
    likedBy: ['demo-b', 'demo-d', 'demo-f', 'demo-h'],
    comments: [
      comment('Yuki', 'Adorable concept, and the glow effects are lovely.', 0),
      comment('Momo', 'I would watch a whole show about this parade.', 0),
    ],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
];

const posts = [];
const users = [];

function save() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify({ posts, users }, null, 2));
  } catch (err) {
    console.error('Failed to persist db.json:', err.message);
  }
}

function attachPasswordCheck(user) {
  user.checkPassword = (pw) => bcrypt.compareSync(pw, user.passwordHash);
  return user;
}

function seedMemory() {
  if (initialized) return;
  if (posts.length) return;
  for (const p of seedPosts) {
    posts.push({ id: randomUUID(), ...p, likes: p.likedBy.length });
  }
}

let initialized = false;

const fileExisted = fs.existsSync(DATA_FILE);
try {
  if (fileExisted) {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    if (Array.isArray(data.posts)) posts.push(...data.posts);
    if (Array.isArray(data.users)) data.users.forEach((u) => users.push(attachPasswordCheck(u)));
  }
} catch (err) {
  console.warn('Could not read db.json, starting fresh:', err.message);
}

if (!fileExisted) {
  seedMemory();
  save();
}

initialized = true;

export { seedMemory };

export const memory = {
  posts,
  users,

  listPosts(search, category) {
    let list = [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q));
    }
    if (category && category !== 'All') {
      list = list.filter((p) => p.category === category);
    }
    return list;
  },

  getPost(id) {
    return posts.find((p) => p.id === id) || null;
  },

  createPost(data) {
    const post = {
      id: randomUUID(),
      title: data.title,
      description: data.description || '',
      image: data.image,
      imagePublicId: data.imagePublicId || '',
      category: data.category || 'Other',
      tags: Array.isArray(data.tags) ? data.tags.filter(Boolean) : [],
      likes: 0,
      likedBy: [],
      comments: [],
      createdAt: new Date(),
    };
    posts.unshift(post);
    save();
    return post;
  },

  toggleLike(id, visitorId) {
    const post = posts.find((p) => p.id === id);
    if (!post) return null;
    const liked = post.likedBy.includes(visitorId);
    if (liked) post.likedBy = post.likedBy.filter((v) => v !== visitorId);
    else post.likedBy.push(visitorId);
    post.likes = post.likedBy.length;
    save();
    return { likes: post.likes, liked: !liked };
  },

  addComment(id, { name, text }) {
    const post = posts.find((p) => p.id === id);
    if (!post) return null;
    const c = { id: randomUUID(), name, text, createdAt: new Date() };
    post.comments.push(c);
    save();
    return c;
  },

  deletePost(id) {
    const idx = posts.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    const [removed] = posts.splice(idx, 1);
    save();
    return removed;
  },

  findUser(username, email) {
    const uname = String(username || '').toLowerCase();
    const mail = String(email || '').toLowerCase();
    return (
      users.find(
        (u) => u.username.toLowerCase() === uname || u.email.toLowerCase() === mail
      ) || null
    );
  },

  findByUsername(username) {
    const uname = String(username || '').toLowerCase();
    return users.find((u) => u.username.toLowerCase() === uname) || null;
  },

  async createUser({ username, email, password, role = 'user' }) {
    const user = {
      id: randomUUID(),
      username,
      email,
      role,
      passwordHash: await bcrypt.hash(password, 10),
    };
    attachPasswordCheck(user);
    users.push(user);
    save();
    return { id: user.id, username: user.username, email: user.email, role: user.role };
  },

  findUserById(id) {
    const u = users.find((x) => x.id === id);
    return u ? { id: u.id, username: u.username, email: u.email, role: u.role } : null;
  },
};
