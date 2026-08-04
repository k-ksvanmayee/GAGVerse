export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
      {message}
    </div>
  );
}
