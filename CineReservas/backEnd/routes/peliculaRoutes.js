import express from "express";
import { getPeliculas } from "../controllers/peliculaController.js";

const router = express.Router();

router.get("/", getPeliculas);

export default router;
