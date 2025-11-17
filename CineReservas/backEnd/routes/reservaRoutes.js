import express from "express";
import { crearReserva } from "../controllers/reservaController.js";

const router = express.Router();

router.post("/", crearReserva);
export default router;
