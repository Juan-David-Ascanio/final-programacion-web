import express from "express";
import { db } from "../db.js";

const router = express.Router();

// Obtener asientos por sala
router.get("/:id_sala", async (req, res) => {
  const { id_sala } = req.params;

  const [rows] = await db.query(
    "SELECT * FROM seats WHERE id_sala = ? ORDER BY seat_number",
    [id_sala]
  );

  res.json(rows);
});

// Reservar asiento (por id)
router.post("/reserve/:id", async (req, res) => {
  const { id } = req.params;

  const [seat] = await db.query(
    "SELECT reserved FROM seats WHERE id = ?",
    [id]
  );

  if (!seat.length)
    return res.status(404).json({ message: "Asiento no existe" });

  if (seat[0].reserved === 1)
    return res.status(400).json({ message: "Asiento ya reservado" });

  await db.query("UPDATE seats SET reserved = 1 WHERE id = ?", [id]);

  res.json({ message: "Asiento reservado correctamente" });
});

// Obtener cantidad de asientos disponibles en una sala
router.get("/available/:id_sala", async (req, res) => {
  const { id_sala } = req.params;

  const [result] = await db.query(
    "SELECT COUNT(*) AS disponibles FROM seats WHERE id_sala = ? AND reserved = 0",
    [id_sala]
  );

  res.json({ disponibles: result[0].disponibles });
});


export default router;
