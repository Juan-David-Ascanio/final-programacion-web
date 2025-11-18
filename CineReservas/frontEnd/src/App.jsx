// src/App.jsx
import React from "react";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Peliculas from "./pages/Peliculas";
import Reservas from "./pages/Reservas";
import Contacto from "./pages/Contacto";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyPin from "./pages/VerifyPin";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import SalaSelector from "./pages/SalaSelector";   //Selector de sala (para pruebas)
import SeatGrid from "./pages/SeatGrid";           //Grid de asientos
import EstadoReservas from "./pages/EstadoReservas";
import Success from "./pages/Success";


export default function App() {
  const [sala, setSala] = useState(1);

  return (
    <div className="app-root">
      <Header />
      <Routes>
        {/* Páginas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/peliculas" element={<Peliculas />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/success" element={<Success />} />


        {/* Páginas protegidas (requieren login) */}
        <Route
          path="/reservas"
          element={
            <ProtectedRoute>
              <Reservas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/estado-reservas"
          element={
            <ProtectedRoute>
              <EstadoReservas />
            </ProtectedRoute>
          }
        />

        {/* Opcional: solo admin (puedes protegerlo luego si quieres) */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Recuperar contraseña */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-pin" element={<VerifyPin />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Ruta por defecto */}
        <Route path="*" element={<Home />} />
        
        <Route
          path="/asientos/:idSala/:cantidad"
          element={
            <ProtectedRoute>
              <SeatGrid />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
