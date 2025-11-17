import db from "../db/connection.js";

export const crearReserva = (req, res) => {
  console.log("📩 LLEGÓ UNA RESERVA:", req.body);
  const { id_usuario, id_funcion, cantidad } = req.body;

  if (!id_funcion || !cantidad) {
    return res.status(400).json({ error: "Datos incompletos." });
  }

  // Verifica asientos disponibles
  const sqlCheck = `
    SELECT asientos_disponibles, precio, id_sala
    FROM funcion
    WHERE id_funcion = ?
  `;

  db.query(sqlCheck, [id_funcion], (err, results) => {
    if (err) {
      console.error("❌ ERROR EN sqlCheck:", err.sqlMessage);
      return res.status(500).json({ error: err.sqlMessage });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Función no encontrada." });
    }

    const disponibles = results[0].asientos_disponibles;
    const precio = results[0].precio;
    const id_sala = results[0].id_sala;

    if (disponibles < cantidad) {
      return res.status(400).json({ error: "No hay suficientes asientos disponibles." });
    }

    const total = precio * cantidad;

    const sqlReserva = `
      INSERT INTO reserva (id_usuario, id_funcion, fecha_reserva, total, estado, cantidad)
      VALUES (?, ?, NOW(), ?, 'confirmada', ?)
    `;

    if (!id_usuario) {
      return res.status(400).json({ error: "Debes iniciar sesión para reservar." });
    }

    db.query(sqlReserva, [id_usuario, id_funcion, total, cantidad], (err2, result) => {
      if (err2) {
        console.error("❌ ERROR EN sqlReserva:", err2.sqlMessage);
        return res.status(500).json({ error: err2.sqlMessage });
      }

      const sqlUpdate = `
        UPDATE funcion
        SET asientos_disponibles = asientos_disponibles - ?
        WHERE id_funcion = ?
      `;

      db.query(sqlUpdate, [cantidad, id_funcion], (err3) => {
        if (err3) {
          console.error("❌ ERROR EN sqlUpdate:", err3.sqlMessage);
          return res.status(500).json({ error: err3.sqlMessage });
        }

        res.json({
          success: true,
          reserva_id: result.insertId,
          id_sala,
          total,
          mensaje: "Reserva creada exitosamente."
        });
      });
    });
  });
};
