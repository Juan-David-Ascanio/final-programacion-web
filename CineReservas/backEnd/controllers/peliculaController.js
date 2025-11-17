// backEnd/controllers/peliculaController.js
import db from "../db/connection.js";

// Películas visibles para usuarios (cartelera)
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

// Listado completo para admin (todas)
export const getPeliculasAdmin = (req, res) => {
  const sql = "SELECT * FROM pelicula ORDER BY id_pelicula ASC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error en getPeliculasAdmin:", err);
      return res
        .status(500)
        .json({ error: "Error al obtener películas (admin)" });
    }
    res.json(results);
  });
};

// Crear película
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
      .json({ error: "Título e imagen son obligatorios." });
  }

  const sql = `
    INSERT INTO pelicula
      (titulo, img, sinopsis, duracion, clasificacion, genero, idioma, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    titulo,
    img,
    sinopsis || null,
    duracion ? Number(duracion) : null,
    clasificacion || null,
    genero || null,
    idioma || null,
    estado || "activa",
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error en createPelicula:", err);
      return res.status(500).json({ error: "Error al crear película" });
    }
    res.json({
      message: "Película creada correctamente.",
      id_pelicula: result.insertId,
    });
  });
};

// Actualizar película (incluye estado)
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
    duracion ? Number(duracion) : null,
    clasificacion || null,
    genero || null,
    idioma || null,
    estado || "activa",
    id,
  ];

  db.query(sql, values, (err) => {
    if (err) {
      console.error("Error en updatePelicula:", err);
      return res.status(500).json({ error: "Error al actualizar película" });
    }
    res.json({ message: "Película actualizada correctamente." });
  });
};

// (Opcional) Eliminar = marcar como inactiva
export const deletePelicula = (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE pelicula SET estado = 'inactiva' WHERE id_pelicula = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      console.error("Error en deletePelicula:", err);
      return res.status(500).json({ error: "Error al inactivar película" });
    }
    res.json({ message: "Película inactivada correctamente." });
  });
};

// Top de películas más reservadas
export const getTopPeliculas = (req, res) => {
  const limit = Number(req.query.limit) || 5;

  const sql = `
    SELECT 
      p.id_pelicula,
      p.titulo,
      p.img,
      COUNT(r.id_reserva) AS total_reservas
    FROM reserva r
    INNER JOIN funcion f ON r.id_funcion = f.id_funcion
    INNER JOIN pelicula p ON f.id_pelicula = p.id_pelicula
    WHERE r.estado <> 'cancelada'
    GROUP BY p.id_pelicula
    ORDER BY total_reservas DESC
    LIMIT ?
  `;

  db.query(sql, [limit], (err, results) => {
    if (err) {
      console.error("Error en getTopPeliculas:", err);
      return res.status(500).json({ error: "Error al obtener estadísticas" });
    }
    res.json(results);
  });
};
