import React, { useState, useEffect } from 'react'
import "./../css/Reservas.css"

export default function Reservas() {
  const [mensaje, setMensaje] = useState('');
  const [funciones, setFunciones] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/funciones")
      .then(res => res.json())
      .then(data => {
        console.log("Funciones desde backend:", data);
        setFunciones(data);
      })
      .catch(err => console.error("Error cargando funciones:", err));
  }, []);

  function handleSubmit(e){
    e.preventDefault();
    const form = new FormData(e.target);
    const nombre = form.get('nombre');
    const pelicula = form.get('pelicula');
    const cantidad = form.get('cantidad');

    setMensaje(`Reserva confirmada para ${nombre} — ${cantidad} boleto(s) para ${pelicula}`);
    e.target.reset();
  }

  return (
    <>
      <section className="reserva-section">
        <h1>🎟 Reserva tus Entradas</h1>

        <form onSubmit={handleSubmit} className="reserva-form">

          <label htmlFor="nombre">👤 Nombre completo</label>
          <input name="nombre" type="text" id="nombre" required placeholder="Ej: Juan Pérez" />

          <label htmlFor="pelicula">🎥 Selecciona la función</label>

          <select name="pelicula" id="pelicula" required>
            <option value="">Seleccione una función</option>

            {/*Pintar funciones AHORA SI desde la BD */}
            {funciones.length > 0 ? (
              funciones.map(f => (
                <option key={f.id_funcion} value={f.id_funcion}>
                {f.titulo} — {new Date(f.fecha).toLocaleDateString("es-CO")} — {f.hora}
                </option>
              ))
            ) : (
              <option disabled>Cargando funciones...</option>
            )}
          </select>

          <label htmlFor="cantidad">🎫 Cantidad de boletos</label>
          <input name="cantidad" type="number" id="cantidad" min="1" max="10" required />

          <button type="submit" className="btn">Confirmar Reserva</button>
        </form>

        <div id="mensaje" className="mensaje">{mensaje}</div>
      </section>

      <footer className="footer">
        <p>&copy; 2025 Cine Reservas | Todos los derechos reservados.</p>
      </footer>
    </>
  )
}
