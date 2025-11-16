import db from "../db/connection.js";

export const crearReserva = (req, res) => {
  const {id_usuario, id_funcion, cantidad } = req.body;

  if (!id_funcion || !cantidad) {
    return res.status(400).json({ error: "Datos incompletos." });
  }

  // Verifica asientos disponibles
  const sqlCheck = `
    SELECT asientos_disponibles, precio
    FROM funcion
    WHERE id_funcion = ?
  `;

  db.query(sqlCheck, [id_funcion], (err, results) => {
    if (err) return res.status(500).json({ error: "Error en la BD." });

    if (results.length === 0) {
      return res.status(404).json({ error: "Función no encontrada." });
    }

    const disponibles = results[0].asientos_disponibles;
    const precio = results[0].precio;

    if (disponibles < cantidad) {
      return res.status(400).json({ error: "No hay suficientes asientos disponibles." });
    }

    const total = precio * cantidad;

    const sqlReserva = `
      INSERT INTO reserva (id_usuario, id_funcion, fecha_reserva, total, estado)
      VALUES (?, ?, NOW(), ?, 'confirmada')
    `;
    if (!id_usuario) {
    return res.status(400).json({ error: "Debes iniciar sesión para reservar." });
    }
    db.query(sqlReserva, [id_usuario, id_funcion, total], (err2, result) => {
      if (err2) return res.status(500).json({ error: "Error creando reserva." });

      const sqlUpdate = `
        UPDATE funcion
        SET asientos_disponibles = asientos_disponibles - ?
        WHERE id_funcion = ?
      `;

      db.query(sqlUpdate, [cantidad, id_funcion], (err3) => {
        if (err3) return res.status(500).json({ error: "Error actualizando asientos." });

        res.json({
          success: true,
          reserva_id: result.insertId,
          total,
          mensaje: "Reserva creada exitosamente."
        });
      });
    });
  });
};
