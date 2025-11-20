import mysql from "mysql2";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// Fix para ESModules (obtener ruta raíz del backend)
const __dirname = path.resolve();
const sqlFile = path.join(__dirname, "Datos iniciales", "cinereservas.sql");

// Crear conexión sin BD seleccionada
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  multipleStatements: true
});

connection.connect(err => {
  if (err) {
    console.error("❌ Error al conectar al servidor MySQL:", err);
    return;
  }
  console.log("🔌 Conectado al servidor MySQL");

  connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`, err => {
    if (err) return console.error("❌ Error creando la base de datos:", err);
    console.log("📦 Base de datos verificada/creada:", process.env.DB_NAME);

    connection.changeUser({ database: process.env.DB_NAME }, err => {
      if (err) return console.error("❌ Error seleccionando la base de datos:", err);
      console.log("📍 Base de datos activa:", process.env.DB_NAME);

      connection.query("SHOW TABLES;", (err, results) => {
        if (err) return console.error("❌ Error revisando tablas:", err);

        // 👉 Si ya hay tablas, no importamos nada
        if (results.length > 0) {
          console.log("✔ Tablas existentes detectadas, omitiendo importación SQL.");
          console.log("🚀 Sistema listo ✅ | Conexión establecida correctamente.");
          return;
        }

        console.log("📤 Importando archivo SQL desde:", sqlFile);

        const sql = fs.readFileSync(sqlFile, "utf8");

        connection.query(sql, err => {
          if (err) return console.error("❌ Error importando datos:", err);

          console.log("🎉 BD importada exitosamente desde el archivo .sql");
          console.log("🚀 Sistema listo ✅ | Conexión establecida y datos importados.");
        });
      });
    });
  });
});

export default connection;
