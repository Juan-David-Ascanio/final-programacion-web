// src/pages/Dashboard.jsx
import { useNavigate } from "react-router-dom";
import { auth } from "../components/auth";
import "./../css/Dashboard.css";

export default function Dashboard() {
  const user = auth.getUser();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <section className="dashboard-container">
      <div className="dashboard-card">
        <h1>Panel de Control</h1>
        <p>Bienvenido, <b>{user.username}</b>.</p>
        <p>Rol: <span className="user-role">{user.role}</span></p>

        <button
          className="logout-btn"
          onClick={() => { auth.logout(); navigate("/"); }}
        >
          Cerrar sesión
        </button>
      </div>
    </section>
  );
}
