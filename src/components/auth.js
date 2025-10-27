// src/components/auth.js
const USERS = [
  { username: "admin", password: "123456", role: "admin" },
  { username: "user", password: "123456", role: "user" },
];

const STORAGE_KEY = "cine_user";

export const auth = {
  login(username, password) {
    const user = USERS.find(
      (u) => u.username === username && u.password === password
    );
    if (!user) return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return true;
  },

  logout() {
    localStorage.removeItem(STORAGE_KEY);
  },

  isLogged() {
    return localStorage.getItem(STORAGE_KEY) !== null;
  },

  getUser() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
};
