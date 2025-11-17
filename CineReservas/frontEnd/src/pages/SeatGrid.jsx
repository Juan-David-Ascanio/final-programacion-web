import { useEffect, useState } from "react";
import "../css/SeatGrid.css";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001"
});


export default function SeatGrid({ idSala }) {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [available, setAvailable] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const loadSeats = async () => {
    const res = await api.get(`/seats/${idSala}`);
    setSeats(res.data);
    setSelectedSeats([]);

    const availableRes = await api.get(`/seats/available/${idSala}`);
    setAvailable(availableRes.data.disponibles);
  };

  useEffect(() => {
    loadSeats();
  }, [idSala]);

  const toggleSeat = (seat) => {
    if (seat.reserved === 1) return;

    if (selectedSeats.includes(seat.id)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat.id]);
    }
  };

  const confirmReservation = async () => {
    try {
      for (const id of selectedSeats) {
        await api.post(`/seats/reserve/${id}`);
      }
      alert("¡Asientos reservados correctamente!");
      setShowModal(false);
      loadSeats();
    } catch (err) {
      alert("Error reservando: " + err.response.data.message);
    }
  };

  // Organizar asientos por filas (ejemplo: A, B, C, etc.)
  const seatRows = {};
  seats.forEach((seat) => {
    const row = seat.seat_number.charAt(0);
    if (!seatRows[row]) seatRows[row] = [];
    seatRows[row].push(seat);
  });

  // Ordenar asientos en cada fila por número para mantener orden lógico
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
      <h1 className="title">Selecciona tus asientos</h1>

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
        Asientos disponibles: {available} | Seleccionados: {selectedSeats.length}
      </div>

      <button
        disabled={selectedSeats.length === 0}
        onClick={() => setShowModal(true)}
        style={{
          padding: "12px 30px",
          fontSize: "18px",
          marginTop: "20px",
          backgroundColor: selectedSeats.length > 0 ? "#1e90ff" : "gray",
          color: "white",
          borderRadius: 6,
          cursor: selectedSeats.length > 0 ? "pointer" : "not-allowed",
        }}
      >
        Confirmar reserva
      </button>

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
