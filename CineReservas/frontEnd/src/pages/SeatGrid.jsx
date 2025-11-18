import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/SeatGrid.css";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

export default function SeatGrid() {
  // Parámetros de la URL
  const { idSala, cantidad } = useParams();
  const salaId = parseInt(idSala, 10);
  const maxCantidad = parseInt(cantidad, 10);

  const navigate = useNavigate();

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [available, setAvailable] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const loadSeats = async () => {
    const res = await api.get(`/seats/${salaId}`);
    setSeats(res.data);
    setSelectedSeats([]);

    const availableRes = await api.get(`/seats/available/${salaId}`);
    setAvailable(availableRes.data.disponibles);
  };

  useEffect(() => {
    loadSeats();
  }, [salaId]);

  const toggleSeat = (seat) => {
    if (seat.reserved === 1) return;

    // Limitar cantidad permitida EXACTA
    if (!selectedSeats.includes(seat.id) && selectedSeats.length >= maxCantidad) {
      alert(`Debes seleccionar exactamente ${maxCantidad} asiento(s).`);
      return;
    }

    if (selectedSeats.includes(seat.id)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat.id]);
    }
  };

const confirmReservation = async () => {
  // Validación estricta
  if (selectedSeats.length !== maxCantidad) {
    alert(`Debes seleccionar exactamente ${maxCantidad} asientos antes de continuar.`);
    return;
  }

  try {
    for (const id of selectedSeats) {
      await api.post(`/seats/reserve/${id}`);
    }

    setShowModal(false);

    // 🎉 Redirección a pantalla de éxito
    navigate("/success");
    window.scrollTo(0, 0);

  } catch (err) {
    alert("Error reservando: " + err.response?.data?.message);
  }
};


  // Agrupar asientos por filas
  const seatRows = {};
  seats.forEach((seat) => {
    const row = seat.seat_number.charAt(0);
    if (!seatRows[row]) seatRows[row] = [];
    seatRows[row].push(seat);
  });

  // Ordenar por número dentro de cada fila
  Object.keys(seatRows).forEach((row) => {
    seatRows[row].sort((a, b) => {
      const numA = parseInt(a.seat_number.slice(1));
      const numB = parseInt(b.seat_number.slice(1));
      return numA - numB;
    });
  });

  const rowLabels = Object.keys(seatRows).sort();

  return (
    <div className="seat-selection-container">
      <h1 className="title">Selecciona tus asientos (exactamente {maxCantidad})</h1>

      <div className="screen">PANTALLA</div>

      <div className="seats">
        {rowLabels.map((row) => (
          <div key={row} className="seat-row">
            {seatRows[row].map((seat) => {
              const isSelected = selectedSeats.includes(seat.id);
              const seatClass = seat.reserved
                ? "seat occupied"
                : isSelected
                ? "seat selected"
                : "seat available";

              return (
                <div
                  key={seat.id}
                  className={seatClass}
                  onClick={() => toggleSeat(seat)}
                >
                  {seat.seat_number}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="selected-info">
        Asientos disponibles: {available} | Seleccionados: {selectedSeats.length}/{maxCantidad}
      </div>

      {/* BOTÓN HABILITADO SOLO SI ES EXACTO */}
      <button
        disabled={selectedSeats.length !== maxCantidad}
        onClick={() => setShowModal(true)}
        style={{
          padding: "12px 30px",
          fontSize: "18px",
          marginTop: "20px",
          backgroundColor:
            selectedSeats.length === maxCantidad ? "#1e90ff" : "gray",
          color: "white",
          borderRadius: 6,
          cursor:
            selectedSeats.length === maxCantidad ? "pointer" : "not-allowed",
        }}
      >
        Confirmar reserva
      </button>

      {/* MODAL */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#0e0e0e",
              color: "white",
              padding: 30,
              borderRadius: 10,
              maxWidth: "400px",
              width: "90%",
              textAlign: "center",
            }}
          >
            <h2>Confirmar reserva</h2>
            <p>¿Deseas reservar los siguientes asientos?</p>

            <p style={{ fontWeight: "bold", marginBottom: 20 }}>
              {selectedSeats
                .map((id) => seats.find((s) => s.id === id)?.seat_number)
                .join(", ")}
            </p>

            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "10px 20px",
                  background: "gray",
                  color: "white",
                  borderRadius: 5,
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>

              <button
                onClick={confirmReservation}
                style={{
                  padding: "10px 20px",
                  background: "#3cb371",
                  color: "white",
                  borderRadius: 5,
                  cursor: "pointer",
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEYENDA */}
      <div className="legend">
        <div>
          <div className="seat available"></div> Disponible
        </div>
        <div>
          <div className="seat selected"></div> Seleccionado
        </div>
        <div>
          <div className="seat occupied"></div> Ocupado
        </div>
      </div>
    </div>
  );
}
