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

// Público
router.get("/", getFunciones);

// Admin – CRUD horarios
router.get("/admin", getFuncionesAdmin);
router.post("/", createFuncion);
router.put("/:id", updateFuncion);
router.delete("/:id", deleteFuncion);

export default router;
