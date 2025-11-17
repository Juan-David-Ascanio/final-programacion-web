import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../css/SeatGrid.css";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001"
});

export default function SeatGrid() {
  // Recibir parámetros de la URL
  const { idSala, cantidad } = useParams();
  const salaId = parseInt(idSala, 10);
  const maxCantidad = parseInt(cantidad, 10);

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

    // 🛑 LIMITE DE ASIENTOS PERMITIDOS
    if (!selectedSeats.includes(seat.id) && selectedSeats.length >= maxCantidad) {
      alert(`Solo puedes seleccionar ${maxCantidad} asiento(s).`);
      return;
    }

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

  // Agrupar por filas
  const seatRows = {};
  seats.forEach((seat) => {
    const row = seat.seat_number.charAt(0);
    if (!seatRows[row]) seatRows[row] = [];
    seatRows[row].push(seat);
  });

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
      <h1 className="title">
        Selecciona tus asientos (máx {maxCantidad})
      </h1>

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
      >
        Confirmar reserva
      </button>

      {showModal && (
        <div className="modal-bg">
          <div className="modal-content">
            <h2>Confirmar reserva</h2>
            <p>¿Deseas reservar los siguientes asientos?</p>

            <p style={{ fontWeight: "bold" }}>
              {selectedSeats
                .map((id) => seats.find((s) => s.id === id)?.seat_number)
                .join(", ")}
            </p>

            <div className="modal-buttons">
              <button onClick={() => setShowModal(false)}>Cancelar</button>
              <button onClick={confirmReservation}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

