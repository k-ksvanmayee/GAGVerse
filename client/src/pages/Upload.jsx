import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

const CATEGORIES = ['Other', 'Action', 'Romance', 'Fantasy', 'Sci-Fi', 'Drama', 'Mystery', 'Comedy', 'Slice of Life'];

function AdminLogin() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim() || !password || busy) return;
    setBusy(true);
    setError('');
    try {
      const res = await api.login(username.trim(), password);
      if (res.user.role !== 'admin') {
        throw new Error('This account is not an admin');
      }
      login(res.token, res.user);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="glass animate-fade-up rounded-3xl p-6">
        <div className="text-center">
          <img
            src="/images/logo.png"
            alt="AniVerse logo"
            className="mx-auto h-14 w-auto rounded-2xl object-contain"
          />
          <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100">Admin access</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            The upload section is reserved for the site admin.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input
            className="input-base"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
          <input
            className="input-base"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          {error && <ErrorMessage message={error} />}
          <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Upload() {
  const { isAdmin } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Other');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  if (!isAdmin) {
    return <AdminLogin />;
  }

  function onFile(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      setError('Please choose an image file');
      return;
    }
    setError('');
    setSuccess('');
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function submit(e) {
    e.preventDefault();
    if (!title.trim() || !file) {
      setError('A title and an image are required');
      return;
    }
    setBusy(true);
    setError('');
    setSuccess('');
    const fd = new FormData();
    fd.append('title', title.trim());
    fd.append('description', description.trim());
    fd.append('category', category);
    if (tags.trim()) fd.append('tags', tags);
    fd.append('image', file);
    try {
      const post = await api.uploadPost(fd);
      setSuccess('Upload successful!');
      setTimeout(() => navigate(`/posts/${post.id}`), 900);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100">Upload artwork</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
        Share a piece of anime art. Your post will appear at the top of the gallery.
      </p>

      <form onSubmit={submit} className="glass mt-8 space-y-5 rounded-3xl p-6">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">Image *</label>
          <input ref={inputRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
          <button
            type="button"
            onClick={() => inputRef.current && inputRef.current.click()}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/60 p-6 text-sm font-medium text-slate-500 transition hover:border-fuchsia-500/60 hover:text-fuchsia-600 dark:border-white/15 dark:bg-white/5 dark:text-slate-300 dark:hover:text-fuchsia-400"
          >
            {preview ? (
              <img src={preview} alt="Preview" className="max-h-72 w-full rounded-xl object-contain" />
            ) : (
              <>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
                Click to choose an image
              </>
            )}
          </button>
          {preview && (
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setPreview('');
              }}
              className="mt-2 text-xs font-semibold text-slate-500 hover:text-red-500 dark:text-slate-400"
            >
              Remove image
            </button>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">Title *</label>
          <input
            className="input-base"
            placeholder="e.g. Blade of the Crimson Sky"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">Description</label>
          <textarea
            className="input-base"
            rows={3}
            placeholder="What inspired this piece?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={2000}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">Category</label>
            <select
              className="input-base"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">Tags</label>
            <input
              className="input-base"
              placeholder="e.g. swords, battle"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              maxLength={200}
            />
          </div>
        </div>

        {error && <ErrorMessage message={error} />}
        {success && (
          <p className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
            {success}
          </p>
        )}

        <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
          {busy ? 'Uploading…' : 'Publish post'}
        </button>
      </form>
    </div>
  );
}
