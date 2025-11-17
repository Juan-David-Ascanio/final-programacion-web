import React, { useEffect, useState } from "react";
import { auth } from "../components/auth";
import "./../css/EstadoReservas.css";

function getBadgeClass(estadoCrudo) {
  const estado = (estadoCrudo || "").toLowerCase();
  if (estado === "confirmado" || estado === "confirmada") {
    return "estado-badge confirmado";
  }
  if (estado === "cancelada") {
    return "estado-badge cancelada";
  }
  return "estado-badge pendiente";
}

function formatEstado(estadoCrudo) {
  const estado = (estadoCrudo || "").toLowerCase();
  if (estado === "confirmado" || estado === "confirmada") return "Confirmado";
  if (estado === "cancelada") return "Cancelada";
  return "Pendiente";
}

export default function EstadoReservas() {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = auth.getUser();

    if (!user) {
      setError("Debes iniciar sesión para ver tus reservas.");
      setCargando(false);
      return;
    }

    const cargarReservas = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/reservas/usuario/${user.id_usuario}`
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Error al obtener las reservas.");
        }

        setReservas(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    cargarReservas();
  }, []);

  return (
    <section className="estado-section">
      <div className="estado-container">
        <h1>Mis reservas</h1>
        <p className="estado-intro">
          Aquí puedes ver el estado de tus reservas de películas.
        </p>

        {cargando && (
          <p className="estado-mensaje">Cargando reservas...</p>
        )}

        {error && !cargando && (
          <p className="estado-mensaje error">{error}</p>
        )}

        {!cargando && !error && reservas.length === 0 && (
          <p className="estado-mensaje">
            Aún no tienes reservas registradas. Ve a la sección de{" "}
            <strong>Reservar</strong> y crea la primera. 🎟️
          </p>
        )}

        <div className="estado-grid">
          {reservas.map((r) => (
            <article key={r.id_reserva} className="reserva-card">
              <div className="reserva-poster">
                <img src={r.img} alt={r.titulo} />
              </div>

              <div className="reserva-info">
                <div className="reserva-header">
                  <h2>{r.titulo}</h2>
                  <span className={getBadgeClass(r.estado)}>
                    {formatEstado(r.estado)}
                  </span>
                </div>

                <p className="reserva-detalle">
                  <span className="label">Función:</span>{" "}
                  {r.fecha_funcion} • {r.hora}
                </p>

                <p className="reserva-detalle">
                  <span className="label">Reserva realizada:</span>{" "}
                  {r.fecha_reserva}
                </p>

                {r.asientos && (
                  <p className="reserva-detalle">
                    <span className="label">Asiento(s):</span> {r.asientos}
                  </p>
                )}

                {r.cantidad && (
                  <p className="reserva-detalle">
                    <span className="label">Boletos:</span> {r.cantidad}
                  </p>
                )}

                <p className="reserva-detalle">
                  <span className="label">Total:</span>{" "}
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    maximumFractionDigits: 0,
                  }).format(r.total)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
