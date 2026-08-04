import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

function readUser() {
  try {
    const raw = localStorage.getItem('anime_admin');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);

  function login(token, userData) {
    setUser(userData);
    localStorage.setItem('anime_token', token);
    localStorage.setItem('anime_admin', JSON.stringify(userData));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('anime_token');
    localStorage.removeItem('anime_admin');
  }

  const isAdmin = !!(user && user.role === 'admin');

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
