// src/pages/Login.jsx
import { useNavigate } from "react-router-dom";
import { auth } from "../components/auth";
import "./../css/Login.css";

export default function Login() {
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const { username, password } = e.target.elements;
    if (auth.login(username.value, password.value)) {
      navigate("/");
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };

  return (
    <section className="login-container">
      <div className="login-box">
        <h1>Iniciar Sesión</h1>
        <form onSubmit={onSubmit}>
          <label>
            Usuario
            <input name="username" type="text" placeholder="admin" required />
          </label>
          <label>
            Contraseña
            <input name="password" type="password" placeholder="123456" required />
          </label>
          <button type="submit" className="login-btn">Entrar</button>
        </form>
        <p className="demo">Demo: <code>admin / 123456</code></p>
      </div>
    </section>
  );
}
