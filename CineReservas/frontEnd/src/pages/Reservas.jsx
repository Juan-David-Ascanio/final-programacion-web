import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";

import "./../css/Reservas.css"

export default function Reservas() {
  const [mensaje, setMensaje] = useState('');
  const [funciones, setFunciones] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/api/funciones")
      .then(res => res.json())
      .then(data => setFunciones(data))
      .catch(err => console.error("Error cargando funciones:", err));
  }, []);

  // Enviar reserva al backend
  async function handleSubmit(e) {
  e.preventDefault();
  const form = new FormData(e.target);

  const id_funcion = form.get("pelicula");
  const cantidad = parseInt(form.get("cantidad"), 10);
  const nombre = form.get("nombre");

  const user = JSON.parse(localStorage.getItem("cine_user"));
  const id_usuario = user ? user.id_usuario : null;

  // 👉 OBTENER ID DE LA SALA
  const funcionSeleccionada = funciones.find(f => f.id_funcion == id_funcion);
  const id_sala = funcionSeleccionada?.id_sala;

  if (!id_sala) {
    setMensaje("❌ Error: la función seleccionada no tiene sala asignada.");
    return;
  }

  const reservaData = {
    id_usuario,
    id_funcion,
    cantidad
  };

  try {
    const res = await fetch("http://localhost:3001/api/reservas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservaData)
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
          <select name="pelicula" required>
            <option value="">Seleccione una función</option>
            {funciones.map(f => (
              <option key={f.id_funcion} value={f.id_funcion}>
                {f.titulo} — {new Date(f.fecha).toLocaleDateString("es-CO")} — {f.hora}
              </option>
            ))}
          </select>

          <label>🎫 Cantidad de boletos</label>
          <input name="cantidad" type="number" min="1" max="10" required />

          <button className="btn" type="submit">Confirmar Reserva</button>
        </form>

        <div className="mensaje">{mensaje}</div>
      </section>
    </>
  );  
}