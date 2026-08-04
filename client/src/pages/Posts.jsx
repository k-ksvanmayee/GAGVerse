import { useEffect, useState } from 'react';
import { api } from '../api.js';
import PostCard from '../components/PostCard.jsx';
import Spinner from '../components/Spinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

const CATEGORIES = ['All', 'Action', 'Romance', 'Fantasy', 'Sci-Fi', 'Drama', 'Mystery', 'Comedy', 'Slice of Life'];

export default function Posts() {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 250);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    let active = true;
    setPosts(null);
    setError('');
    api
      .getPosts({ search: debounced, category })
      .then((data) => active && setPosts(data))
      .catch((e) => active && setError(e.message));
    return () => {
      active = false;
    };
  }, [debounced, category]);

  function handleDelete(id) {
    setPosts((prev) => (prev ? prev.filter((p) => p.id !== id) : prev));
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100">Posts</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          {posts ? `${posts.length} piece${posts.length === 1 ? '' : 's'} of art` : 'Browse the gallery'}
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4">
        <div className="relative max-w-md">
          <svg
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            className="input-base pl-11 pr-9"
            placeholder="Search by title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search posts"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`chip ${category === c ? 'chip-active' : ''}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {error && <ErrorMessage message={error} />}
      {!posts && !error && <Spinner />}
      {posts && posts.length === 0 && (
        <p className="py-12 text-center text-slate-500 dark:text-slate-400">
          No posts match your search. Try a different title or category.
        </p>
      )}
      {posts && posts.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
