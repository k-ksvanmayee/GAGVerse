import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { getVisitorId } from '../utils/visitor.js';
import { timeAgo } from '../utils/format.js';
import LikeButton from '../components/LikeButton.jsx';
import CommentSection from '../components/CommentSection.jsx';
import Spinner from '../components/Spinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [busy, setBusy] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);

  useEffect(() => {
    let active = true;
    setError('');
    setPost(null);
    api
      .getPost(id)
      .then((p) => {
        if (!active) return;
        setPost(p);
        setLikes(p.likes ?? 0);
        setLiked(p.likedBy?.includes(getVisitorId()) ?? false);
      })
      .catch((e) => active && setError(e.message));
    return () => {
      active = false;
    };
  }, [id]);

  async function handleToggleLike() {
    if (busy || !post) return;
    setBusy(true);
    try {
      const res = await api.toggleLike(post.id, getVisitorId());
      setLiked(res.liked);
      setLikes(res.likes);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  function handleCommentAdded(comment) {
    setPost((p) => (p ? { ...p, comments: [...p.comments, comment] } : p));
  }

  async function handleDelete() {
    if (deleteBusy || !post) return;
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    setDeleteBusy(true);
    try {
      await api.deletePost(post.id);
      navigate('/posts');
    } catch (err) {
      setDeleteBusy(false);
      setError(err.message);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link
        to="/posts"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-fuchsia-600 dark:text-slate-400 dark:hover:text-fuchsia-400"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to posts
      </Link>

      {error && <ErrorMessage message={error} />}

      {!post && !error && <Spinner />}

      {post && (
        <article className="animate-fade-up">
          <div className="glass overflow-hidden rounded-3xl">
            <img src={post.image} alt={post.title} className="max-h-[70vh] w-full object-cover" />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100">{post.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                {post.category && (
                  <span className="rounded-full bg-fuchsia-500/10 px-3 py-1 text-xs font-semibold text-fuchsia-600 dark:text-fuchsia-400">
                    {post.category}
                  </span>
                )}
                <span>Uploaded {timeAgo(post.createdAt)}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <LikeButton liked={liked} count={likes} onToggle={handleToggleLike} disabled={busy} />
              {isAdmin && (
                <button
                  onClick={handleDelete}
                  disabled={deleteBusy}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-500/20 active:scale-95 disabled:opacity-60 dark:text-red-400"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6" />
                  </svg>
                  {deleteBusy ? 'Deleting…' : 'Delete post'}
                </button>
              )}
            </div>
          </div>

          {post.description && (
            <p className="mt-5 text-base leading-relaxed text-slate-600 dark:text-slate-300">{post.description}</p>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <span key={t} className="chip">
                  #{t}
                </span>
              ))}
            </div>
          )}

          <CommentSection postId={post.id} comments={post.comments} onAdded={handleCommentAdded} />
        </article>
      )}
    </div>
  );
}
