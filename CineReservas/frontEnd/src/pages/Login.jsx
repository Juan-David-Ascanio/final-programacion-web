import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../components/auth";
import "../css/Login.css";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await auth.login(correo, contrasena);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Iniciar sesión</h2>

        {error && <p className="error-msg">{error}</p>}

        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
        />

        <button type="submit">Entrar</button>

        <p className="register-link">
          ¿No tienes cuenta aún? 
          <a href="/register">Crear cuenta</a>
        </p>


      </form>
    </div>
  );
}