const API_ROOT = (import.meta.env.VITE_API_BASE || '').replace(/\/+$/, '');
const BASE = `${API_ROOT}/api`;

export function fullUrl(url) {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_ROOT}${url}`;
}

function authHeaders() {
  const token = localStorage.getItem('anime_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders(), ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    let message = 'Request failed';
    try {
      const data = await res.json();
      message = data.message || message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  return res.json();
}

export const api = {
  getPosts({ search, category } = {}) {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category && category !== 'All') params.set('category', category);
    const qs = params.toString();
    return request(`/posts${qs ? `?${qs}` : ''}`);
  },

  getPost(id) {
    return request(`/posts/${encodeURIComponent(id)}`);
  },

  async uploadPost(formData) {
    const res = await fetch(`${BASE}/posts`, { method: 'POST', headers: authHeaders(), body: formData });
    if (!res.ok) {
      let message = 'Upload failed';
      try {
        const data = await res.json();
        message = data.message || message;
      } catch {
        /* ignore */
      }
      throw new Error(message);
    }
    return res.json();
  },

  deletePost(id) {
    return request(`/posts/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },

  login(username, password) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  toggleLike(id, visitorId) {
    return request(`/posts/${encodeURIComponent(id)}/like`, {
      method: 'POST',
      body: JSON.stringify({ visitorId }),
    });
  },

  addComment(id, data) {
    return request(`/posts/${encodeURIComponent(id)}/comments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
