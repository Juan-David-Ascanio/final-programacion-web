import db from "../db/connection.js";

export const getPeliculas = (req, res) => {
    const sql = "SELECT * FROM pelicula WHERE estado = 'activa'";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error al obtener películas" });
        }
        res.json(results);
    });
};
