export default function LikeButton({ liked, count, onToggle, disabled }) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      aria-label={liked ? 'Unlike this post' : 'Like this post'}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition active:scale-90 disabled:opacity-60 ${
        liked
          ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/30'
          : 'border border-slate-900/10 bg-white/60 text-slate-600 hover:border-pink-500/50 hover:text-pink-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-pink-400'
      }`}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        className={liked ? 'fill-current' : 'fill-none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {count}
    </button>
  );
}
