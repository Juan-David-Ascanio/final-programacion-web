// backEnd/controllers/funcionController.js
import db from "../db/connection.js";

// === PÚBLICO: lista de funciones (solo para mostrar) ===
export const getFunciones = (req, res) => {
    const sql = `
        SELECT 
            f.id_funcion, 
            p.titulo, 
            f.id_sala,
            f.fecha, 
            f.hora
        FROM funcion f
        INNER JOIN pelicula p ON f.id_pelicula = p.id_pelicula
    `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error en getFunciones:", err);
      return res.status(500).json({ error: "Error al obtener funciones" });
    }
    res.json(results);
  });
};

// === ADMIN: mismas funciones, pero pensadas para panel ===
export const getFuncionesAdmin = (req, res) => {
  const sql = `
    SELECT 
      f.id_funcion,
      f.id_pelicula,
      p.titulo,
      f.id_sala,
      s.nombre,
      f.fecha,
      f.hora,
      f.precio,
      f.asientos_disponibles
    FROM funcion f
    INNER JOIN pelicula p ON f.id_pelicula = p.id_pelicula
    INNER JOIN salas s ON f.id_sala = s.id_sala
    ORDER BY f.fecha, f.hora
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error en getFuncionesAdmin:", err);
      return res
        .status(500)
        .json({ error: "Error al obtener funciones (admin)" });
    }
    res.json(results);
  });
};

// === ADMIN: crear función (horario) ===
export const createFuncion = (req, res) => {
  const { id_pelicula, id_sala, fecha, hora, precio } = req.body;

  if (!id_pelicula || !id_sala || !fecha || !hora || !precio) {
    return res
      .status(400)
      .json({ error: "Faltan datos obligatorios para la función." });
  }

  // 1️⃣ Consultar asientos disponibles desde tabla seats
  const sqlCountSeats = `
    SELECT COUNT(*) AS disponibles
    FROM seats
    WHERE id_sala = ? AND reserved = 0
  `;

  db.query(sqlCountSeats, [id_sala], (err, seatsResult) => {
    if (err) {
      console.error("Error en sqlCountSeats:", err);
      return res.status(500).json({ error: "Error obteniendo asientos disponibles" });
    }

    const asientos_disponibles = seatsResult[0].disponibles;

    // 2️⃣ Crear la función usando el valor calculado
    const sqlInsert = `
      INSERT INTO funcion (id_pelicula, id_sala, fecha, hora, precio, asientos_disponibles)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
      id_pelicula,
      id_sala,
      fecha,
      hora,
      precio,
      asientos_disponibles,
    ];

    db.query(sqlInsert, values, (err2, result) => {
      if (err2) {
        console.error("Error en createFuncion:", err2);
        return res.status(500).json({ error: "Error al crear la función" });
      }

      res.json({
        success: true,
        id_funcion: result.insertId,
        asientos_disponibles,
        message: "Función creada correctamente",
      });
    });
  });
};


// === ADMIN: actualizar función ===
export const updateFuncion = (req, res) => {
  const { id } = req.params;
  const { id_pelicula, id_sala, fecha, hora, precio, asientos_disponibles } =
    req.body;

  if (!id_pelicula || !id_sala || !fecha || !hora || !precio) {
    return res
      .status(400)
      .json({ error: "Faltan datos obligatorios para la función." });
  }

  const sql = `
    UPDATE funcion
    SET id_pelicula = ?, id_sala = ?, fecha = ?, hora = ?, precio = ?, asientos_disponibles = ?
    WHERE id_funcion = ?
  `;

  const values = [
    id_pelicula,
    id_sala,
    fecha,
    hora,
    precio,
    asientos_disponibles || null,
    id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error en updateFuncion:", err);
      return res
        .status(500)
        .json({ error: "Error al actualizar la función" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Función no encontrada" });
    }

    res.json({ success: true, message: "Función actualizada" });
  });
};

// === ADMIN: eliminar función ===
export const deleteFuncion = (req, res) => {
  const { id } = req.params;

  // 1️⃣ Primero obtenemos la sala asociada a la función
  const sqlGetSala = "SELECT id_sala FROM funcion WHERE id_funcion = ?";

  db.query(sqlGetSala, [id], (err, result) => {
    if (err) {
      console.error("Error consultando la función:", err);
      return res.status(500).json({ error: "Error al obtener la función" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Función no encontrada" });
    }

    const idSala = result[0].id_sala;

    // 2️⃣ Eliminamos la función
    const sqlDelete = "DELETE FROM funcion WHERE id_funcion = ?";

    db.query(sqlDelete, [id], (err, deleteResult) => {
      if (err) {
        console.error("Error al eliminar la función:", err);
        return res.status(500).json({ error: "Error al eliminar función" });
      }

      // 3️⃣ Liberamos los asientos de esa sala
      const sqlUpdateSeats = `
        UPDATE seats 
        SET reserved = 0 
        WHERE id_sala = ?
      `;

      db.query(sqlUpdateSeats, [idSala], (err, updateResult) => {
        if (err) {
          console.error("Error liberando asientos:", err);
          return res.status(500).json({ error: "Error al liberar asientos" });
        }

        res.json({
          success: true,
          message: "Función eliminada y asientos liberados",
        });
      });
    });
  });
};
