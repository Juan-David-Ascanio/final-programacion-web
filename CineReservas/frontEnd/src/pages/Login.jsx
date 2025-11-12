import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../components/auth";
import { Eye, EyeOff } from "lucide-react"; // 👈 Importamos los íconos
import "../css/Login.css";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false); // 👈 Nuevo estado
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

        {/* Campo de contraseña con el ojito */}
        <div className="password-container">
          <input
            type={mostrarContrasena ? "text" : "password"}
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
          <span
            className="eye-icon"
            onClick={() => setMostrarContrasena(!mostrarContrasena)}
          >
            {mostrarContrasena ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        <button type="submit">Entrar</button>

        <p className="register-link">
          ¿No tienes cuenta aún?
          <a href="/register">Crear cuenta</a>
        </p>
      </form>
    </div>
  );
}
