import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { getVisitorId } from '../utils/visitor.js';
import { timeAgo } from '../utils/format.js';
import LikeButton from './LikeButton.jsx';

export default function PostCard({ post, onDelete }) {
  const visitorId = getVisitorId();
  const { isAdmin } = useAuth();
  const [liked, setLiked] = useState(() => post.likedBy?.includes(visitorId) ?? false);
  const [count, setCount] = useState(post.likes ?? 0);
  const [busy, setBusy] = useState(false);

  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [commentBusy, setCommentBusy] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [deleteBusy, setDeleteBusy] = useState(false);

  async function handleToggle() {
    if (busy) return;
    setBusy(true);
    try {
      const res = await api.toggleLike(post.id, visitorId);
      setLiked(res.liked);
      setCount(res.likes);
    } catch {
      /* keep previous state */
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (deleteBusy) return;
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    setDeleteBusy(true);
    try {
      await api.deletePost(post.id);
      onDelete?.(post.id);
    } catch (err) {
      setDeleteBusy(false);
      window.alert(err.message);
    }
  }

  async function submitComment(e) {
    e.preventDefault();
    if (!name.trim() || !text.trim() || commentBusy) return;
    setCommentBusy(true);
    setCommentError('');
    try {
      const comment = await api.addComment(post.id, { name: name.trim(), text: text.trim() });
      setComments((c) => [...c, comment]);
      setName('');
      setText('');
    } catch (err) {
      setCommentError(err.message);
    } finally {
      setCommentBusy(false);
    }
  }

  return (
    <article className="glass card-hover group overflow-hidden rounded-2xl">
      <Link to={`/posts/${post.id}`} className="block overflow-hidden">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          {post.category && (
            <span className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
              {post.category}
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/posts/${post.id}`} className="block">
          <h3 className="line-clamp-1 text-base font-bold text-slate-800 transition group-hover:text-fuchsia-600 dark:text-slate-100 dark:group-hover:text-fuchsia-400">
            {post.title}
          </h3>
        </Link>
        {post.description && (
          <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{post.description}</p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-slate-400 dark:text-slate-500">{timeAgo(post.createdAt)}</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowComments((s) => !s)}
              aria-expanded={showComments}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                showComments
                  ? 'border-fuchsia-500/60 bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400'
                  : 'border-slate-900/10 bg-white/60 text-slate-600 hover:border-fuchsia-500/50 hover:text-fuchsia-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-fuchsia-400'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {comments.length}
            </button>
            <LikeButton liked={liked} count={count} onToggle={handleToggle} disabled={busy} />
            {isAdmin && (
              <button
                onClick={handleDelete}
                disabled={deleteBusy}
                aria-label={`Delete ${post.title}`}
                title="Delete post"
                className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-500/20 active:scale-90 disabled:opacity-60 dark:text-red-400"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6" />
                </svg>
                {deleteBusy ? '…' : 'Delete'}
              </button>
            )}
          </div>
        </div>

        {showComments && (
          <div className="mt-4 border-t border-slate-900/10 pt-3 dark:border-white/10">
            {comments.length > 0 && (
              <ul className="mb-3 max-h-32 space-y-2 overflow-y-auto pr-1">
                {comments.slice(-3).map((c) => (
                  <li key={c.id} className="rounded-xl bg-slate-900/5 px-3 py-2 dark:bg-white/5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{c.name}</span>
                      <span className="shrink-0 text-[10px] text-slate-400 dark:text-slate-500">{timeAgo(c.createdAt)}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">{c.text}</p>
                  </li>
                ))}
              </ul>
            )}
            {comments.length > 3 && (
              <Link to={`/posts/${post.id}`} className="mb-2 block text-xs font-semibold text-fuchsia-600 hover:underline dark:text-fuchsia-400">
                View all {comments.length} comments
              </Link>
            )}
            <form onSubmit={submitComment} className="space-y-2">
              <input
                className="input-base !py-2 text-xs"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
                required
              />
              <textarea
                className="input-base !py-2 text-xs"
                rows={2}
                placeholder="Write a comment…"
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={2000}
                required
              />
              {commentError && <p className="text-xs text-red-500">{commentError}</p>}
              <button type="submit" disabled={commentBusy} className="btn-primary !px-4 !py-1.5 text-xs disabled:opacity-60">
                {commentBusy ? 'Posting…' : 'Post comment'}
              </button>
            </form>
          </div>
        )}
      </div>
    </article>
  );
}
