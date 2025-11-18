import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./../css/Reservas.css";

export default function Reservas() {
  const [mensaje, setMensaje] = useState("");
  const [funciones, setFunciones] = useState([]);
  const [funcionSeleccionada, setFuncionSeleccionada] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadFunciones() {
      try {
        const res = await fetch("http://localhost:3001/api/funciones");
        const data = await res.json();

        // Agregar asientos disponibles a cada función
        const funcionesConDisponibilidad = await Promise.all(
          data.map(async (f) => {
            try {
              const r = await fetch(`http://localhost:3001/seats/available/${f.id_sala}`);
              const json = await r.json();
              return { ...f, disponibles: json.disponibles };
            } catch {
              return { ...f, disponibles: "?" };
            }
          })
        );

        setFunciones(funcionesConDisponibilidad);
      } catch (err) {
        console.error("Error cargando funciones:", err);
      }
    }

    loadFunciones();
  }, []);

  // 🎯 Evento cuando el usuario selecciona una función
  const handleFuncionChange = (e) => {
    const id = e.target.value;
    const f = funciones.find((fun) => fun.id_funcion == id);
    setFuncionSeleccionada(f || null);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);

    const id_funcion = form.get("pelicula");
    const cantidad = parseInt(form.get("cantidad"), 10);
    const nombre = form.get("nombre");

    const user = JSON.parse(localStorage.getItem("cine_user"));
    const id_usuario = user ? user.id_usuario : null;

    if (!funcionSeleccionada) {
      setMensaje("❌ Debes seleccionar una función válida.");
      return;
    }

    if (cantidad > funcionSeleccionada.disponibles) {
      setMensaje(`❌ Solo hay ${funcionSeleccionada.disponibles} asientos disponibles.`);
      return;
    }

    const reservaData = { id_usuario, id_funcion, cantidad };

    try {
      const res = await fetch("http://localhost:3001/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservaData),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensaje("❌ " + data.error);
        return;
      }

      setMensaje(`✔️ Reserva confirmada para ${nombre} — ${cantidad} boleto(s).`);
      navigate(`/asientos/${data.id_sala}/${cantidad}`);
      e.target.reset();

    } catch (error) {
      console.error("Error reservando:", error);
      setMensaje("❌ Error al crear la reserva.");
    }
  }

  return (
    <>
      <section className="reserva-section">
        <h1>🎟 Reserva tus Entradas</h1>

        <form onSubmit={handleSubmit} className="reserva-form">

          <label>👤 Nombre completo</label>
          <input name="nombre" type="text" required placeholder="Ej: Juan Pérez" />

          <label>🎥 Selecciona la función</label>
          <select name="pelicula" required onChange={handleFuncionChange}>
            <option value="">Seleccione una función</option>
            {funciones.map((f) => (
              <option key={f.id_funcion} value={f.id_funcion}>
                {f.titulo} — {new Date(f.fecha).toLocaleDateString("es-CO")} — {f.hora}
              </option>
            ))}
          </select>

          {/* 🔥 CUADRO DE DISPONIBILIDAD */}
          {funcionSeleccionada && (
            <div className="disponibilidad-box">
              <strong>Asientos disponibles:</strong>{" "}
              <span style={{ color: "#3cb371", fontWeight: "bold" }}>
                {funcionSeleccionada.disponibles}
              </span>
            </div>
          )}

          <label>🎫 Cantidad de boletos</label>
          <input name="cantidad" type="number" min="1" max="10" required />

          <button className="btn" type="submit">
            Escoger asiento(s)
          </button>
        </form>

        <div className="mensaje">{mensaje}</div>
      </section>

      <footer className="footer">
        <p>&copy; 2025 Cine Reservas | Todos los derechos reservados.</p>
      </footer>
    </>
  );
}
