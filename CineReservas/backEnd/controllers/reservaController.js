import db from "../db/connection.js";

/**
 * Crea una reserva:
 * - Verifica asientos disponibles en la función
 * - Calcula el total (precio * cantidad)
 * - Inserta en la tabla `reserva`
 * - Actualiza los asientos disponibles de la función
 */
export const crearReserva = (req, res) => {
  const { id_usuario, id_funcion, cantidad } = req.body;

  if (!id_funcion || !cantidad) {
    return res.status(400).json({ error: "Datos incompletos." });
  }

  const sqlCheck = `
    SELECT asientos_disponibles, precio
    FROM funcion
    WHERE id_funcion = ?
  `;

  db.query(sqlCheck, [id_funcion], (err, results) => {
    if (err) {
      console.error("Error verificando función:", err);
      return res.status(500).json({ error: "Error en la base de datos." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Función no encontrada." });
    }

    const disponibles = results[0].asientos_disponibles;
    const precio = results[0].precio;

    if (disponibles < cantidad) {
      return res
        .status(400)
        .json({ error: "No hay suficientes asientos disponibles." });
    }

    const total = Number(precio) * Number(cantidad);

    if (!id_usuario) {
      return res
        .status(400)
        .json({ error: "Debes iniciar sesión para reservar." });
    }

    // OJO: aquí uso 'confirmado' como en el ENUM de la BD
    const sqlReserva = `
      INSERT INTO reserva (id_usuario, id_funcion, fecha_reserva, total, estado)
      VALUES (?, ?, NOW(), ?, 'confirmado')
    `;

    db.query(sqlReserva, [id_usuario, id_funcion, total], (err2, result) => {
      if (err2) {
        console.error("Error creando reserva:", err2);
        return res.status(500).json({ error: "Error creando reserva." });
      }

      const sqlUpdate = `
        UPDATE funcion
        SET asientos_disponibles = asientos_disponibles - ?
        WHERE id_funcion = ?
      `;

      db.query(sqlUpdate, [cantidad, id_funcion], (err3) => {
        if (err3) {
          console.error("Error actualizando asientos:", err3);
          return res
            .status(500)
            .json({ error: "Error actualizando asientos." });
        }

        res.json({
          success: true,
          reserva_id: result.insertId,
          total,
          mensaje: "Reserva creada exitosamente.",
        });
      });
    });
  });
};

/**
 * Devuelve las reservas de un usuario con:
 * - Película (título, portada)
 * - Fecha y hora de la función
 * - Fecha de reserva, total, estado
 * - Asientos (si existen en reserva_asiento/asiento)
 */
export const obtenerReservasPorUsuario = (req, res) => {
  const { idUsuario } = req.params;

  const sql = `
    SELECT
      r.id_reserva,
      DATE_FORMAT(r.fecha_reserva, '%Y-%m-%d') AS fecha_reserva,
      r.total,
      COALESCE(r.estado, 'pendiente') AS estado,
      DATE_FORMAT(f.fecha, '%Y-%m-%d') AS fecha_funcion,
      DATE_FORMAT(f.hora, '%H:%i') AS hora_funcion,
      f.precio,
      p.titulo,
      p.img,
      u.nombre AS nombre_usuario,
      GROUP_CONCAT(a.numero_asiento ORDER BY a.numero_asiento SEPARATOR ', ') AS asientos
    FROM reserva r
    INNER JOIN funcion f   ON r.id_funcion = f.id_funcion
    INNER JOIN pelicula p  ON f.id_pelicula = p.id_pelicula
    INNER JOIN usuario u   ON r.id_usuario = u.id_usuario
    LEFT JOIN reserva_asiento ra ON r.id_reserva = ra.id_reserva
    LEFT JOIN asiento a         ON ra.id_asiento = a.id_asiento
    WHERE r.id_usuario = ?
    GROUP BY
      r.id_reserva,
      r.fecha_reserva,
      r.total,
      r.estado,
      f.fecha,
      f.hora,
      f.precio,
      p.titulo,
      p.img,
      u.nombre
    ORDER BY r.fecha_reserva DESC, f.fecha DESC, f.hora DESC
  `;

  db.query(sql, [idUsuario], (err, rows) => {
    if (err) {
      console.error("Error obteniendo reservas:", err);
      return res
        .status(500)
        .json({ error: "Error al obtener las reservas del usuario." });
    }

    const reservas = rows.map((row) => {
      const total = Number(row.total);
      const precio = Number(row.precio);

      const cantidad =
        !isNaN(total) && !isNaN(precio) && precio > 0
          ? Math.round(total / precio)
          : null;

      return {
        id_reserva: row.id_reserva,
        fecha_reserva: row.fecha_reserva,
        total,
        estado: row.estado,            // 'pendiente', 'confirmado', 'cancelada'
        fecha_funcion: row.fecha_funcion,
        hora: row.hora_funcion,
        titulo: row.titulo,
        img: row.img,
        nombre_usuario: row.nombre_usuario,
        cantidad,                      // cantidad de boletos aprox.
        asientos: row.asientos,        // ej: "A1, A2, B3" o null
      };
    });

    res.json(reservas);
  });
};
