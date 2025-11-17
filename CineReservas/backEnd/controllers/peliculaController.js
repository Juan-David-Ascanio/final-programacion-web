// backEnd/controllers/peliculaController.js
import db from "../db/connection.js";

// === PÚBLICO: cartelera (solo activas) ===
export const getPeliculas = (req, res) => {
  const sql = "SELECT * FROM pelicula WHERE estado = 'activa'";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error en getPeliculas:", err);
      return res.status(500).json({ error: "Error al obtener películas" });
    }
    res.json(results);
  });
};

// === ADMIN: listar TODAS las películas ===
export const getPeliculasAdmin = (req, res) => {
  const sql = "SELECT * FROM pelicula";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error en getPeliculasAdmin:", err);
      return res.status(500).json({ error: "Error al obtener películas (admin)" });
    }
    res.json(results);
  });
};

// === ADMIN: crear película ===
export const createPelicula = (req, res) => {
  const {
    titulo,
    img,
    sinopsis,
    duracion,
    clasificacion,
    genero,
    idioma,
    estado,
  } = req.body;

  if (!titulo || !img) {
    return res
      .status(400)
      .json({ error: "Titulo e imagen son obligatorios." });
  }

  const sql = `
    INSERT INTO pelicula (titulo, img, sinopsis, duracion, clasificacion, genero, idioma, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    titulo,
    img,
    sinopsis || null,
    duracion || null,
    clasificacion || null,
    genero || null,
    idioma || null,
    estado || "activa",
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error en createPelicula:", err);
      return res
        .status(500)
        .json({ error: "Error al crear la película" });
    }

    res.json({
      success: true,
      id_pelicula: result.insertId,
      message: "Película creada correctamente",
    });
  });
};

// === ADMIN: actualizar película ===
export const updatePelicula = (req, res) => {
  const { id } = req.params;
  const {
    titulo,
    img,
    sinopsis,
    duracion,
    clasificacion,
    genero,
    idioma,
    estado,
  } = req.body;

  if (!titulo || !img) {
    return res
      .status(400)
      .json({ error: "Titulo e imagen son obligatorios." });
  }

  const sql = `
    UPDATE pelicula
    SET titulo = ?, img = ?, sinopsis = ?, duracion = ?, clasificacion = ?,
        genero = ?, idioma = ?, estado = ?
    WHERE id_pelicula = ?
  `;

  const values = [
    titulo,
    img,
    sinopsis || null,
    duracion || null,
    clasificacion || null,
    genero || null,
    idioma || null,
    estado || "activa",
    id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error en updatePelicula:", err);
      return res
        .status(500)
        .json({ error: "Error al actualizar la película" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Película no encontrada" });
    }

    res.json({ success: true, message: "Película actualizada" });
  });
};

// === ADMIN: “eliminar” película (la marcamos inactiva) ===
export const deletePelicula = (req, res) => {
  const { id } = req.params;

  const sql = `
    UPDATE pelicula
    SET estado = 'inactiva'
    WHERE id_pelicula = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error en deletePelicula:", err);
      return res
        .status(500)
        .json({ error: "Error al eliminar la película" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Película no encontrada" });
    }

    res.json({ success: true, message: "Película marcada como inactiva" });
  });
};

// === ADMIN: estadísticas – películas más reservadas ===
export const getPeliculasMasVistas = (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 5;

  const sql = `
    SELECT 
      p.id_pelicula,
      p.titulo,
      p.img,
      COUNT(r.id_reserva) AS total_reservas
    FROM reserva r
    INNER JOIN funcion f ON r.id_funcion = f.id_funcion
    INNER JOIN pelicula p ON f.id_pelicula = p.id_pelicula
    GROUP BY p.id_pelicula
    ORDER BY total_reservas DESC
    LIMIT ?
  `;

  db.query(sql, [limit], (err, results) => {
    if (err) {
      console.error("Error en getPeliculasMasVistas:", err);
      return res
        .status(500)
        .json({ error: "Error al obtener estadísticas" });
    }

    res.json(results);
  });
};
