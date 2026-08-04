export function getVisitorId() {
  let id = localStorage.getItem('anime_visitor');
  if (!id) {
    id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `v-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('anime_visitor', id);
  }
  return id;
}
