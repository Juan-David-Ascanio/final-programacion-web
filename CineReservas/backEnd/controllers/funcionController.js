import db from "../db/connection.js";

export const getFunciones = (req, res) => {
    const sql = `
        SELECT 
            f.id_funcion, 
            p.titulo, 
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
