import { isDBConnected } from '../config/db.js';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { memory, seedMemory } from './memory.js';

let seeded = false;

function ensureSeed() {
  if (!seeded) {
    seedMemory();
    seeded = true;
  }
}

function serializePost(doc) {
  if (!doc) return null;
  if (doc._id !== undefined) {
    return {
      id: String(doc._id),
      title: doc.title,
      description: doc.description,
      image: doc.image,
      category: doc.category,
      tags: doc.tags || [],
      likes: doc.likes ?? 0,
      likedBy: (doc.likedBy || []).map(String),
      comments: (doc.comments || []).map((c) => ({
        id: c._id ? String(c._id) : c.id,
        name: c.name,
        text: c.text,
        createdAt: c.createdAt,
      })),
      createdAt: doc.createdAt,
    };
  }
  return doc;
}

function serializeUser(doc) {
  if (!doc) return null;
  if (doc._id !== undefined) {
    return { id: String(doc._id), username: doc.username, email: doc.email, role: doc.role || 'user' };
  }
  return doc;
}

export const repo = {
  async listPosts(search, category) {
    if (isDBConnected()) {
      const filter = {};
      if (search) filter.title = { $regex: search, $options: 'i' };
      if (category && category !== 'All') filter.category = category;
      const docs = await Post.find(filter).sort({ createdAt: -1 }).lean();
      return docs.map(serializePost);
    }
    ensureSeed();
    return memory.listPosts(search, category);
  },

  async getPost(id) {
    if (isDBConnected()) {
      try {
        const doc = await Post.findById(id).lean();
        return serializePost(doc);
      } catch {
        return null;
      }
    }
    ensureSeed();
    return memory.getPost(id);
  },

  async createPost(data) {
    if (isDBConnected()) {
      const doc = await Post.create(data);
      return serializePost(doc.toObject());
    }
    ensureSeed();
    return memory.createPost(data);
  },

  async toggleLike(id, visitorId) {
    if (isDBConnected()) {
      try {
        const post = await Post.findById(id);
        if (!post) return null;
        const liked = post.likedBy.map(String).includes(visitorId);
        if (liked) post.likedBy = post.likedBy.filter((x) => String(x) !== visitorId);
        else post.likedBy.push(visitorId);
        post.likes = post.likedBy.length;
        await post.save();
        return { likes: post.likes, liked: !liked };
      } catch {
        return null;
      }
    }
    ensureSeed();
    return memory.toggleLike(id, visitorId);
  },

  async addComment(id, { name, text }) {
    if (isDBConnected()) {
      try {
        const post = await Post.findById(id);
        if (!post) return null;
        post.comments.push({ name, text });
        await post.save();
        const c = post.comments[post.comments.length - 1];
        return { id: String(c._id), name: c.name, text: c.text, createdAt: c.createdAt };
      } catch {
        return null;
      }
    }
    ensureSeed();
    return memory.addComment(id, { name, text });
  },

  async deletePost(id) {
    if (isDBConnected()) {
      try {
        const doc = await Post.findByIdAndDelete(id).lean();
        return doc ? serializePost(doc) : null;
      } catch {
        return null;
      }
    }
    ensureSeed();
    return memory.deletePost(id);
  },

  async findUser(username, email) {
    if (isDBConnected()) {
      return User.findOne({
        $or: [
          { username: username || '' },
          { email: email || '' },
        ],
      });
    }
    return memory.findUser(username, email);
  },

  async findByUsername(username) {
    if (isDBConnected()) {
      return User.findOne({ username: username || '' });
    }
    return memory.findByUsername(username);
  },

  async createUser({ username, email, password, role = 'user' }) {
    if (isDBConnected()) {
      const user = new User({ username, email, role });
      user.setPassword(password);
      await user.save();
      return serializeUser(user.toObject());
    }
    return memory.createUser({ username, email, password, role });
  },

  async findUserById(id) {
    if (isDBConnected()) {
      try {
        const doc = await User.findById(id).lean();
        return serializeUser(doc);
      } catch {
        return null;
      }
    }
    return memory.findUserById(id);
  },
};
