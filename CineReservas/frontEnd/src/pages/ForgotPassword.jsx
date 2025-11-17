import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

export default function ForgotPassword() {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/usuarios/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al enviar el PIN");
      } else {
        setMensaje("Se ha enviado un PIN a tu correo. Revisa tu bandeja de entrada.");
        setTimeout(() => navigate("/verify-pin", { state: { correo } }), 2500);
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
        <h2>Recuperar contraseña</h2>

        {mensaje && <p className="success-msg">{mensaje}</p>}
        {error && <p className="error-msg">{error}</p>}

        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Enviar PIN"}
        </button>

        <p className="register-link">
          ¿Recordaste tu contraseña?{" "}
          <a href="/login">Iniciar sesión</a>
        </p>
      </form>
    </div>
  );
}
