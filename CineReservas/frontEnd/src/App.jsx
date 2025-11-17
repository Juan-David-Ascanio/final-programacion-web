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
import SalaSelector from "./pages/SalaSelector";   //Selector de sala
import SeatGrid from "./pages/SeatGrid";           //Grid de asientos


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

        {/* 🔒 Páginas protegidas */}
        <Route
          path="/reservas"
          element={
            <ProtectedRoute>
              <Reservas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/asientos"
          element={
            <ProtectedRoute>
              <h1>Reserva de Asientos</h1>
              <SalaSelector selectedSala={sala} onChange={setSala} />
              <SeatGrid idSala={sala} />
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

        {/* Opcional: solo admin */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Ruta por defecto */}
        <Route path="*" element={<Home />} />
        {/* Ruta para recuperar contraseña */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* Ruta para verificar pin */}
        <Route path="/verify-pin" element={<VerifyPin />} />
        {/* Ruta para restablecer contraseña */}
        <Route path="/reset-password" element={<ResetPassword />} />

      </Routes>
    </div>
  );
}
