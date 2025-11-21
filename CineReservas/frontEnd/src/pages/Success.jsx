import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Home from "./Home";
import "./../css/Success.css";

export default function Success() {
  const navigate = useNavigate();
  
  const [fadeOut, setFadeOut] = useState(false); // control de animación

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true); // comenzamos animación de salida
    }, 4500); // empieza fade-out a los 2.5 segundos

    const redirectTimer = setTimeout(() => {
      navigate("/");
    }, 5000); // redirección suave después del fade-out

    return () => {
      clearTimeout(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className={`success-wrapper ${fadeOut ? "fade-out" : ""}`}>
      
      <div className="success-background">
        <Home />
      </div>

      <div className="success-overlay">
        <div className="success-card">
          <h1>🎉 ¡Reserva Exitosa!</h1>
          <p>Estamos procesando tu información...</p>
          <p>Serás redirigido al inicio en un momento.</p>
        </div>
      </div>

    </div>
  );
}
