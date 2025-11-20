import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import peliculaRoutes from "./routes/peliculaRoutes.js"; // <-- NUEVO
import "./db/connection.js";
import funcionRoutes from "./routes/funcionRoutes.js";
import reservaRoutes from "./routes/reservaRoutes.js";
import seatsRoutes from "./routes/seat.js";  //grid de asientos
import seat from "./routes/seat.js"; //Ruta cantidad de asientos


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/usuarios", userRoutes);
app.use("/api/peliculas", peliculaRoutes); // <-- NUEVA RUTA
app.use("/api/funciones", funcionRoutes);
app.use("/api/reservas", reservaRoutes);
app.use("/seats", seatsRoutes); //grid de asientos
app.use("/api/asientos", seat); //Para consultar cantidad de asientos

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
