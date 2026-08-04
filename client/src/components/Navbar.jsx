import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const linkCls = ({ isActive }) =>
  `rounded-lg px-3.5 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-fuchsia-600/25'
      : 'text-slate-600 hover:bg-white/60 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
  }`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAdmin, user, logout } = useAuth();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/posts', label: 'Posts' },
    { to: '/upload', label: isAdmin ? 'Upload' : 'Admin' },
  ];

  return (
    <header className="glass sticky top-0 z-40">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <img
            src="/images/logo.png"
            alt="AniVerse logo"
            className="h-10 w-auto rounded-xl object-contain"
          />
          <span className="font-display bg-gradient-to-r from-violet-400 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
            AniVerse
          </span>
        </Link>

        <div className="hidden items-center gap-1 sm:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkCls}>
              {l.label}
            </NavLink>
          ))}
          {isAdmin && (
            <>
              <span className="mx-1 h-6 w-px bg-slate-900/10 dark:bg-white/10" />
              <span className="text-xs text-slate-500 dark:text-slate-400">@{user.username}</span>
              <button
                onClick={logout}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white/60 hover:text-red-500 dark:text-slate-300 dark:hover:bg-white/10"
              >
                Logout
              </button>
            </>
          )}
          <span className="mx-1 h-6 w-px bg-slate-900/10 dark:bg-white/10" />
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            className="grid h-9 w-9 place-items-center rounded-lg text-slate-700 transition hover:bg-white/60 dark:text-slate-200 dark:hover:bg-white/10"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-slate-900/10 px-4 pb-3 sm:hidden dark:border-white/10">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `mt-2 block rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white'
                    : 'text-slate-600 dark:text-slate-300'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          {isAdmin && (
            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="mt-2 block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-white/60 hover:text-red-500 dark:text-slate-300 dark:hover:bg-white/10"
            >
              Logout (@{user.username})
            </button>
          )}
        </div>
      )}
    </header>
  );
}
