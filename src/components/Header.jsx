// src/components/Header.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../components/auth";
import "./../css/Header.css";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const user = auth.getUser();
  const isLogged = !!user;

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    auth.logout();
    navigate("/");
    closeMenu();
  };

  return (
    <header className="navbar">
      <div className="nav-inner container-wide">

        <NavLink to="/" className="brand" onClick={closeMenu}>
          <img src="/img/logo.png" alt="Cine Reservas" className="brand-logo" />
          <span className="brand-text">Cine Reservas</span>
        </NavLink>

        <div className={`hamburger ${isOpen ? "active" : ""}`} onClick={toggleMenu}>
          <div></div><div></div><div></div>
        </div>

        <nav className={`nav-links ${isOpen ? "open" : ""}`}>
          <NavLink to="/" end onClick={closeMenu}>Inicio</NavLink>
          <NavLink to="/peliculas" onClick={closeMenu}>Películas</NavLink>
          <NavLink to="/reservas" onClick={closeMenu}>Reservar</NavLink>
          <NavLink to="/contacto" onClick={closeMenu}>Contacto</NavLink>

          <span className="grow" />

          {isLogged ? (
            <>
              {user.role === "admin" && (
                <NavLink to="/dashboard" onClick={closeMenu}>
                  Mi Cuenta
                </NavLink>
              )}
            </>
          ) : (
            <NavLink to="/login" onClick={closeMenu}>Login</NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
