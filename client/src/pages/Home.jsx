import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import PostCard from '../components/PostCard.jsx';
import Spinner from '../components/Spinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

const CONTACT_EMAIL = 'animegirl361278@gmail.com';
const SOCIALS = [
  { label: 'X / Twitter', href: 'https://x.com', icon: '𝕏' },
  { label: 'Instagram', href: 'https://instagram.com/animegirl_1305', icon: 'IG' },
  { label: 'Discord', href: 'https://discord.com', icon: 'DC' },
];

function ContactSection() {
  return (
    <section id="contact" className="border-t border-slate-900/10 bg-slate-50/60 py-16 dark:border-white/10 dark:bg-white/[0.02]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 sm:text-3xl">Get in touch</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
            Questions, collabs, or just want to say hi? Reach out.
          </p>
        </div>

        <div className="mx-auto max-w-xl">
          <div className="glass rounded-3xl p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Email</h3>
            <a href={`mailto:${CONTACT_EMAIL}`} className="mt-2 block font-semibold text-slate-800 hover:text-fuchsia-600 dark:text-slate-100 dark:hover:text-fuchsia-400">
              {CONTACT_EMAIL}
            </a>
            <h3 className="mt-6 text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Follow</h3>
            <ul className="mt-3 space-y-2">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-slate-900/10 bg-white/60 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-fuchsia-500/50 hover:text-fuchsia-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:text-fuchsia-400"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-xs font-black text-white">
                      {s.icon}
                    </span>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

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
            GAGVerse
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
            <Link to="/admin" className="btn-secondary">
              Admin portal
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

      <ContactSection />
    </div>
  );
}
