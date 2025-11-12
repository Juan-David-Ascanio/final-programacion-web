import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // 👈 usamos estos íconos se instala con npm install lucide-react
import "./../css/Register.css";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // 👈 estado del ojo

  const [form, setForm] = useState({
    nombre: "",
    nombre_usuario: "",
    correo: "",
    contrasena: "",
    telefono: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" | "error"

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{7,15}$/;

    if (!emailRegex.test(form.correo)) {
      setMessage("❌ Ingresa un correo electrónico válido.");
      setMessageType("error");
      return;
    }

    if (form.telefono && !phoneRegex.test(form.telefono)) {
      setMessage("❌ El teléfono debe contener solo números y tener entre 7 y 15 dígitos.");
      setMessageType("error");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/api/usuarios", {
        nombre: form.nombre,
        nombre_usuario: form.nombre_usuario,
        correo: form.correo,
        contrasena: form.contrasena,
        rol: "cliente",
        telefono: form.telefono || null,
      });

      if (response.status === 201 || response.status === 200) {
        setMessage("✅ Registro exitoso. Redirigiendo...");
        setMessageType("success");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      setMessage("❌ Error al registrar usuario.");
      setMessageType("error");
    }
  };

  return (
    <section className="register-container">
      <div className="register-card">
        <h1>Crear Cuenta</h1>

        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="nombre_usuario"
            placeholder="Nombre de usuario"
            value={form.nombre_usuario}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="correo"
            placeholder="Correo electrónico"
            value={form.correo}
            onChange={handleChange}
            required
          />

          {/* === CAMPO DE CONTRASEÑA CON OJO === */}
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="contrasena"
              placeholder="Contraseña"
              value={form.contrasena}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Mostrar u ocultar contraseña"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <input
            type="tel"
            name="telefono"
            placeholder="Teléfono (opcional)"
            value={form.telefono}
            onChange={handleChange}
          />

          <button className="register-btn" type="submit">
            Registrarse
          </button>
        </form>

        {message && (
          <p
            className={`message-box ${
              messageType === "success" ? "success-msg" : "error-msg"
            }`}
          >
            {message}
          </p>
        )}

        <p className="login-link">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </section>
  );
}
