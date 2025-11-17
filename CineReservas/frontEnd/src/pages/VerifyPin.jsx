import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/Login.css";

export default function VerifyPin() {
  const location = useLocation();
  const navigate = useNavigate();
  const correo = location.state?.correo || "";

  const [pin, setPin] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/usuarios/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, pin }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "PIN incorrecto o expirado");
      } else {
        setMensaje("PIN verificado correctamente");
        setTimeout(() => navigate("/reset-password", { state: { correo, pin } }), 2000);
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
        <h2>Verificar PIN</h2>

        {mensaje && <p className="success-msg">{mensaje}</p>}
        {error && <p className="error-msg">{error}</p>}

        <input
          type="text"
          placeholder="Ingresa el PIN recibido"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Verificando..." : "Verificar PIN"}
        </button>

        <p className="register-link">
          ¿No recibiste el correo?{" "}
          <a href="/forgot-password">Reenviar PIN</a>
        </p>
      </form>
    </div>
  );
}
