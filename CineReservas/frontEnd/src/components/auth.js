const STORAGE_KEY = "cine_user";

export const auth = {
  async login(correo, contrasena) {
    try {
      const response = await fetch("http://localhost:3001/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena }),
      });

      const data = await response.json();

      if (!response.ok) return { ok: false, error: data.error };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
      return { ok: true };
    } catch (error) {
      return { ok: false, error: "Error de conexión con el servidor" };
    }
  },

  logout() {
    localStorage.removeItem(STORAGE_KEY);
  },

  isLogged() {
    return localStorage.getItem(STORAGE_KEY) !== null;
  },

  getUser() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  },
};
