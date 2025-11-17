// src/components/Header.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../components/auth";
import "./../css/Header.css";
import { FaUser } from "react-icons/fa"; // Ícono junto a "Mi cuenta"

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
      <div className="nav-inner">
        {/* Marca / logo */}
        <NavLink to="/" className="brand" onClick={closeMenu}>
          <img
            src="/img/logo.png"
            alt="Cine Reservas"
            className="brand-logo"
          />
          <span className="brand-text">Cine Reservas</span>
        </NavLink>

        {/* Botón hamburguesa (mobile) */}
        <div
          className={`hamburger ${isOpen ? "active" : ""}`}
          onClick={toggleMenu}
        >
          <div></div>
          <div></div>
          <div></div>
        </div>

        {/* Links de navegación */}
        <nav className={`nav-links ${isOpen ? "open" : ""}`}>
          <NavLink to="/" end onClick={closeMenu}>
            Inicio
          </NavLink>

          <NavLink to="/peliculas" onClick={closeMenu}>
            Cartelera
          </NavLink>

          <NavLink to="/reservas" onClick={closeMenu}>
            Reservar
          </NavLink>

          {/* 🔹 NUEVO LINK: Estado de reservas */}
          <NavLink to="/estado-reservas" onClick={closeMenu}>
            Mis reservas
          </NavLink>

          <NavLink to="/contacto" onClick={closeMenu}>
            Contacto
          </NavLink>

          {/* Zona derecha: login / cuenta */}
          {isLogged ? (
            <>
              <NavLink to="/dashboard" onClick={closeMenu}>
                <FaUser /> Mi Cuenta
              </NavLink>
              <button
                type="button"
                className="logout-btn"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={closeMenu}>
                Login
              </NavLink>
                <NavLink to="/register" onClick={closeMenu}>
                Crear cuenta
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
