import express from "express";
import {
  crearReserva,
  obtenerReservasPorUsuario,
} from "../controllers/reservaController.js";

const router = express.Router();

// Crear reserva
router.post("/", crearReserva);

// Obtener reservas de un usuario (para EstadoReservas)
router.get("/usuario/:idUsuario", obtenerReservasPorUsuario);

export default router;
