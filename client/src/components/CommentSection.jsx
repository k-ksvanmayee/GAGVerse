import { useState } from 'react';
import { api } from '../api.js';
import { timeAgo } from '../utils/format.js';

export default function CommentSection({ postId, comments = [], onAdded }) {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    if (!name.trim() || !text.trim() || busy) return;
    setBusy(true);
    setError('');
    try {
      const comment = await api.addComment(postId, { name: name.trim(), text: text.trim() });
      setName('');
      setText('');
      onAdded?.(comment);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-lg font-bold text-slate-800 dark:text-slate-100">
        Comments <span className="font-normal text-slate-400 dark:text-slate-500">({comments.length})</span>
      </h2>

      <form onSubmit={submit} className="glass mb-6 space-y-3 rounded-2xl p-4">
        <input
          className="input-base"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
          required
        />
        <textarea
          className="input-base"
          rows={3}
          placeholder="Share your thoughts…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={2000}
          required
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" disabled={busy} className="btn-primary disabled:opacity-60">
          {busy ? 'Posting…' : 'Post comment'}
        </button>
      </form>

      {comments.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">No comments yet. Be the first to share your thoughts!</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-800 dark:text-slate-100">{c.name}</span>
                <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">{timeAgo(c.createdAt)}</span>
              </div>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{c.text}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
