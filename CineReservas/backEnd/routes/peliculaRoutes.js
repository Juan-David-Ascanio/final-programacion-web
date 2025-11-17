// backEnd/routes/peliculaRoutes.js
import express from "express";
import {
  getPeliculas,
  getPeliculasAdmin,
  createPelicula,
  updatePelicula,
  deletePelicula,
  getTopPeliculas,
} from "../controllers/peliculaController.js";

const router = express.Router();

// Público (cartelera)
router.get("/", getPeliculas);

// Admin – CRUD
router.get("/admin", getPeliculasAdmin);
router.post("/", createPelicula);
router.put("/:id", updatePelicula);
router.delete("/:id", deletePelicula); // no lo usamos desde el front, pero queda

// Estadísticas
router.get("/top", getTopPeliculas);

export default router;
