import connection from "../db/connection.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
// Obtener todos los usuarios
export const getUsers = (req, res) => {
  connection.query("SELECT * FROM usuario", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Obtener un usuario por ID
export const getUserById = (req, res) => {
  const { id } = req.params;
  connection.query("SELECT * FROM usuario WHERE id_usuario = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
};

// Crear usuario
export const createUser = (req, res) => {
  const { nombre, nombre_usuario, correo, contrasena, rol, telefono } = req.body;
  const query = "INSERT INTO usuario (nombre, nombre_usuario, correo, contrasena, rol, telefono) VALUES (?, ?, ?, ?, ?, ?)";
  connection.query(query, [nombre, nombre_usuario, correo, contrasena, rol, telefono], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id_usuario: result.insertId, nombre, correo });
  });
};

// Actualizar usuario
export const updateUser = (req, res) => {
  const { id } = req.params;
  const { nombre, nombre_usuario, correo, contrasena, rol, telefono } = req.body;
  const query = "UPDATE usuario SET nombre=?, nombre_usuario=?, correo=?, contrasena=?, rol=?, telefono=? WHERE id_usuario=?";
  connection.query(query, [nombre, nombre_usuario, correo, contrasena, rol, telefono, id], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Usuario actualizado correctamente" });
  });
};

// Eliminar usuario
export const deleteUser = (req, res) => {
  const { id } = req.params;
  connection.query("DELETE FROM usuario WHERE id_usuario = ?", [id], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Usuario eliminado correctamente" });
  });
};

// Login de usuario
export const loginUser = (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ error: "Correo y contraseña requeridos" });
  }

  const query = "SELECT * FROM usuario WHERE correo = ?";
  
  connection.query(query, [correo], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const user = results[0];

    // Comparación de contraseñas
    if (user.contrasena !== contrasena) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    res.json({
      message: "Login exitoso",
      user: {
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol
      }
    });
  });
};
//Recuperar contraseña
export const forgotPassword = (req, res) => {
  const { correo } = req.body;

  if (!correo) return res.status(400).json({ error: "Correo requerido" });

  // Generar PIN
  const pin = Math.floor(100000 + Math.random() * 900000);

  // Guardar PIN
  const query = `
    UPDATE usuario 
    SET reset_pin = ?, reset_expiration = DATE_ADD(NOW(), INTERVAL 10 MINUTE) 
    WHERE correo = ?;
  `;

  connection.query(query, [pin, correo], async (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Correo no encontrado" });

    // Enviar el correo
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Soporte CineReservas" <${process.env.EMAIL_USER}>`,
        to: correo,
        subject: "Recuperación de contraseña",
        text: `Tu código de recuperación es: ${pin}. Este código expirará en 10 minutos.`,
      });

      console.log(`PIN enviado correctamente a ${correo}`);
      res.json({ message: "PIN enviado al correo registrado" });
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      res.status(500).json({ error: "Error al enviar el correo" });
    }
  });
};

// Verificar PIN
export const verifyPin = (req, res) => {
  const { correo, pin } = req.body;

  if (!correo || !pin) {
    return res.status(400).json({ error: "Correo y PIN son requeridos" });
  }

  const query = "SELECT reset_pin, reset_expiration FROM usuario WHERE correo = ?";
  connection.query(query, [correo], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

    const user = results[0];

    // Verificar  el PIN y tiempo de expiración
    const now = new Date();
    const expiration = new Date(user.reset_expiration);

    if (user.reset_pin !== pin) {
      return res.status(400).json({ error: "PIN incorrecto" });
    }

    if (now > expiration) {
      return res.status(400).json({ error: "PIN expirado, solicita uno nuevo" });
    }

    res.json({ message: "PIN válido" });
  });
};

// Restablecer contraseña
export const resetPassword = (req, res) => {
  const { correo, pin, nuevaContrasena } = req.body;

  if (!correo || !pin || !nuevaContrasena) {
    return res.status(400).json({ error: "Correo, PIN y nueva contraseña son requeridos" });
  }

  const query = "SELECT reset_pin, reset_expiration FROM usuario WHERE correo = ?";
  connection.query(query, [correo], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

    const user = results[0];
    const now = new Date();
    const expiration = new Date(user.reset_expiration);

    if (user.reset_pin !== pin) {
      return res.status(400).json({ error: "PIN incorrecto" });
    }

    if (now > expiration) {
      return res.status(400).json({ error: "PIN expirado, solicita uno nuevo" });
    }

    // Actualiza la contraseña
    const updateQuery = `
      UPDATE usuario 
      SET contrasena = ?, reset_pin = NULL, reset_expiration = NULL 
      WHERE correo = ?
    `;

    connection.query(updateQuery, [nuevaContrasena, correo], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ message: "Contraseña actualizada correctamente" });
    });
  });
};