import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import PostCard from '../components/PostCard.jsx';
import Spinner from '../components/Spinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function Home() {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api
      .getPosts()
      .then((data) => active && setPosts(data))
      .catch((e) => active && setError(e.message));
    return () => {
      active = false;
    };
  }, []);

  function handleDelete(id) {
    setPosts((prev) => (prev ? prev.filter((p) => p.id !== id) : prev));
  }

  return (
    <div>
      <section className="relative overflow-hidden">
        <img
          src="/images/hero.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-night-950/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-night-950/40 via-transparent to-night-950" />
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-40 dark:opacity-100" />
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 animate-pulse-glow rounded-full bg-violet-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 animate-pulse-glow rounded-full bg-fuchsia-500/20 blur-3xl" style={{ animationDelay: '1.5s' }} />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 animate-pulse-glow rounded-full bg-cyan-400/15 blur-3xl" style={{ animationDelay: '3s' }} />

        <div className="relative mx-auto max-w-6xl px-4 py-24 text-center sm:px-6 sm:py-32">
          <p className="animate-fade-up font-tech text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">
            AniVerse
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white drop-shadow-lg sm:text-6xl">
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
              Share the art that moves you.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-slate-200 sm:text-lg">
            A minimal gallery for anime artwork. Like your favorites, drop a comment, and upload your own pieces.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/posts" className="btn-primary">
              Browse posts
            </Link>
            <Link to="/upload" className="btn-secondary">
              Upload artwork
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Latest artwork</h2>
          <Link to="/posts" className="text-sm font-semibold text-fuchsia-600 hover:underline dark:text-fuchsia-400">
            View all →
          </Link>
        </div>

        {error && <ErrorMessage message={error} />}
        {!posts && !error && <Spinner />}
        {posts && posts.length === 0 && (
          <p className="py-12 text-center text-slate-500 dark:text-slate-400">
            No posts yet. Be the first to upload something beautiful!
          </p>
        )}
        {posts && posts.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 6).map((p) => (
              <PostCard key={p.id} post={p} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
