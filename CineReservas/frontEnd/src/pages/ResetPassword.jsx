import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/Login.css";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const correo = location.state?.correo || "";
  const pin = location.state?.pin || "";

  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (nuevaContrasena !== confirmarContrasena) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/usuarios/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, pin, nuevaContrasena }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al cambiar la contraseña");
      } else {
        setMensaje("Contraseña actualizada correctamente");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Restablecer Contraseña</h2>

        {mensaje && <p className="success-msg">{mensaje}</p>}
        {error && <p className="error-msg">{error}</p>}

        <input
          type="password"
          placeholder="Nueva contraseña"
          value={nuevaContrasena}
          onChange={(e) => setNuevaContrasena(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmarContrasena}
          onChange={(e) => setConfirmarContrasena(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Actualizando..." : "Cambiar contraseña"}
        </button>
      </form>
    </div>
  );
}