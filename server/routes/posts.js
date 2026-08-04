import { Router } from 'express';
import { repo } from '../store/index.js';
import { adminRequired } from '../middleware/auth.js';
import { upload, saveImage, deleteImage, deleteLocalImage } from '../middleware/upload.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const posts = await repo.listPosts(search, category);
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const post = await repo.getPost(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    next(err);
  }
});

router.post('/', adminRequired, upload.single('image'), async (req, res, next) => {
  try {
    const { title, description, category, tags } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'An image is required' });
    }
    const { url, publicId } = await saveImage(req.file);
    const tagList = typeof tags === 'string' && tags.trim()
      ? tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];
    const post = await repo.createPost({
      title: title.trim(),
      description: (description || '').trim(),
      category: (category || 'Other').trim(),
      tags: tagList,
      image: url,
      imagePublicId: publicId,
    });
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/like', async (req, res, next) => {
  try {
    const visitorId = req.body && req.body.visitorId;
    if (!visitorId) {
      return res.status(400).json({ message: 'visitorId is required' });
    }
    const result = await repo.toggleLike(req.params.id, String(visitorId));
    if (!result) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/comments', async (req, res, next) => {
  try {
    const { name, text } = req.body || {};
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'A name is required' });
    }
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'A comment is required' });
    }
    const comment = await repo.addComment(req.params.id, {
      name: name.trim().slice(0, 60),
      text: text.trim().slice(0, 2000),
    });
    if (!comment) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', adminRequired, async (req, res, next) => {
  try {
    const post = await repo.getPost(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    deleteLocalImage(post.image);
    deleteImage(post.imagePublicId);
    await repo.deletePost(req.params.id);
    res.json({ ok: true, id: req.params.id });
  } catch (err) {
    next(err);
  }
});

export default router;
