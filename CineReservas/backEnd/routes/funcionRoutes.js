// backEnd/routes/funcionRoutes.js
import express from "express";
import {
  getFunciones,
  getFuncionesAdmin,
  createFuncion,
  updateFuncion,
  deleteFuncion,
} from "../controllers/funcionController.js";

const router = express.Router();

// === PÚBLICO ===
// Lista de funciones para mostrar horarios en el front (si se usa)
router.get("/", getFunciones);

// === ADMIN – CRUD HORARIOS ===
router.get("/admin", getFuncionesAdmin); // todas las funciones
router.post("/", createFuncion);         // crear nueva función
router.put("/:id", updateFuncion);       // actualizar función
router.delete("/:id", deleteFuncion);    // eliminar función

export default router;
