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

// Inicializa el sistema de cierre automático por inactividad.
// timeout es el tiempo en milisegundos (por defecto 10 min)
auth.initAutoLogout = (timeout = 10 * 60 * 1000) => {
  let timer; // Variable donde guardamos el contador de inactividad

  // Función que reinicia el temporizador cada vez que hay actividad
  const resetTimer = () => {
    clearTimeout(timer); // Borra el contador anterior y empieza uno nuevo

    const raw = localStorage.getItem(STORAGE_KEY); // Obtiene usuario guardado
    if (!raw) return; // Si no hay usuario, no hay sesión para renovar

    const user = JSON.parse(raw); // Convertimos el JSON a objeto

    // Actualizamos el tiempo de expiración en base al "ahora + timeout"
    user.exp = Date.now() + timeout;

    // Guardamos nuevamente el usuario con la nueva expiración
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));

    // Creamos un nuevo temporizador: si pasa el tiempo sin actividad, se ejecuta
    timer = setTimeout(() => {
      auth.logout(); // Borra datos del usuario
      alert("Sesión cerrada por inactividad"); // Mensaje al usuario
      window.location.href = "/login"; // Redirige al login
    }, timeout);
  };

  // EVENTOS QUE CUENTAN COMO ACTIVIDAD DEL USUARIO
  // Si el usuario mueve el mouse, hace click, escribe, o hace scroll,
  // reseteamos el contador
  ["click", "mousemove", "keydown", "scroll"].forEach(event =>
    window.addEventListener(event, resetTimer)
  );

  // Iniciamos el contador por primera vez
  resetTimer();
};
