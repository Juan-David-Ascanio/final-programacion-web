import React, { useState } from "react";
import "./../css/SeatSelection.css";

const rows = "ABCDEFGHIJKLMNOPQR".split("");
const seatsPerRow = 16;

export default function SeatSelection() {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSeatClick = (seatId) => {
    if (occupiedSeats.includes(seatId)) return; // No permitir seleccionar ocupados
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId]
    );
  };

  // Ejemplo de asientos ocupados
  const occupiedSeats = ["C5", "C6", "C7", "D10", "F8", "L12", "R3"];

  return (
    <div className="seat-selection-container">
      <h1 className="title">🎟️ Selección de Asientos</h1>

      <div className="screen">PANTALLA</div>

      {/* 🔹 Cabecera de números de columnas */}
      <div className="column-numbers">
        <span className="row-label"></span> {/* espacio vacío para alinear */}
        {Array.from({ length: seatsPerRow }, (_, i) => (
          <span key={i} className="column-number">
            {i + 1}
          </span>
        ))}
      </div>

      {/* 🔹 Asientos */}
      <div className="seats">
        {rows.map((row) => (
          <div key={row} className="seat-row">
            <span className="row-label">{row}</span>
            {Array.from({ length: seatsPerRow }, (_, i) => {
              const seatId = `${row}${i + 1}`;
              const isSelected = selectedSeats.includes(seatId);
              const isOccupied = occupiedSeats.includes(seatId);
              return (
                <div
                  key={seatId}
                  className={`seat ${
                    isOccupied
                      ? "occupied"
                      : isSelected
                      ? "selected"
                      : "available"
                  }`}
                  onClick={() => handleSeatClick(seatId)}
                  title={seatId}
                ></div>
              );
            })}
          </div>
        ))}
      </div>

      {/* 🔹 Leyenda */}
      <div className="legend">
        <div>
          <span className="seat available"></span> Disponible
        </div>
        <div>
          <span className="seat selected"></span> Seleccionado
        </div>
        <div>
          <span className="seat occupied"></span> Ocupado
        </div>
      </div>

      {/* 🔹 Info de selección */}
      <div className="selected-info">
        <h2>Tus asientos seleccionados:</h2>
        {selectedSeats.length > 0 ? (
          <p>{selectedSeats.join(", ")}</p>
        ) : (
          <p>No has seleccionado asientos aún.</p>
        )}
      </div>
    </div>
  );
}
