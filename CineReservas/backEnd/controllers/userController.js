import connection from "../db/connection.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

// Obtener todos los usuarios
export const getUsers = (req, res) => {
  connection.query(
    "SELECT id_usuario, nombre, nombre_usuario, correo, rol, telefono FROM usuario",
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};

// Obtener un usuario por ID
export const getUserById = (req, res) => {
  const { id } = req.params;
  connection.query(
    "SELECT id_usuario, nombre, nombre_usuario, correo, rol, telefono FROM usuario WHERE id_usuario = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results[0]);
    }
  );
};

// Crear usuario (con hashing)
export const createUser = async (req, res) => {
  const { nombre, nombre_usuario, correo, contrasena, rol, telefono } = req.body;

  try {
    const hashedPass = await bcrypt.hash(contrasena, 10);

    const query = `
      INSERT INTO usuario (nombre, nombre_usuario, correo, contrasena, rol, telefono)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    connection.query(
      query,
      [nombre, nombre_usuario, correo, hashedPass, rol, telefono],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.status(201).json({
          id_usuario: result.insertId,
          nombre,
          correo,
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

// Actualizar usuario (sin cambiar contraseña a menos que se envíe)
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nombre, nombre_usuario, correo, contrasena, rol, telefono } = req.body;

  let hashedPass = null;

  if (contrasena) {
    hashedPass = await bcrypt.hash(contrasena, 10);
  }

  const query = `
    UPDATE usuario
    SET nombre=?, nombre_usuario=?, correo=?, contrasena=COALESCE(?, contrasena), rol=?, telefono=?
    WHERE id_usuario=?
  `;

  connection.query(
    query,
    [nombre, nombre_usuario, correo, hashedPass, rol, telefono, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Usuario actualizado correctamente" });
    }
  );
};

// Eliminar usuario
export const deleteUser = (req, res) => {
  const { id } = req.params;
  connection.query("DELETE FROM usuario WHERE id_usuario = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Usuario eliminado correctamente" });
  });
};

// Login con verificación de hash
export const loginUser = (req, res) => {
  const { correo, contrasena } = req.body;

  const query = "SELECT * FROM usuario WHERE correo = ?";

  connection.query(query, [correo], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(401).json({ error: "Usuario no encontrado" });

    const user = results[0];

    const validPass = await bcrypt.compare(contrasena, user.contrasena);

    if (!validPass) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    res.json({
      message: "Login exitoso",
      user: {
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
      },
    });
  });
};

//Resetear contraseña (con hashing)
export const resetPassword = async (req, res) => {
  const { correo, pin, nuevaContrasena } = req.body;

  const query = "SELECT reset_pin, reset_expiration FROM usuario WHERE correo = ?";

  connection.query(query, [correo], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

    const user = results[0];

    // Verificar PIN usando bcrypt
    const pinValido = await bcrypt.compare(pin.toString(), user.reset_pin);
    if (!pinValido) return res.status(400).json({ error: "PIN incorrecto" });

    // Verificar expiración
    if (new Date() > new Date(user.reset_expiration)) {
      return res.status(400).json({ error: "PIN expirado" });
    }

    // Hashear nueva contraseña
    const hashedPass = await bcrypt.hash(nuevaContrasena, 10);

    const updateQuery = `
      UPDATE usuario 
      SET contrasena = ?, reset_pin = NULL, reset_expiration = NULL 
      WHERE correo = ?
    `;

    connection.query(updateQuery, [hashedPass, correo], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ message: "Contraseña actualizada correctamente" });
    });
  });
};


//Recuperar contraseña
export const forgotPassword = async (req, res) => {
  const { correo } = req.body;
  if (!correo) return res.status(400).json({ error: "Correo requerido" });

  // Generar PIN
  const pin = Math.floor(100000 + Math.random() * 900000).toString();

  // Hashear PIN
  const hashedPin = await bcrypt.hash(pin, 10);

  // Guardar PIN hasheado + expiración
  const query = `
    UPDATE usuario 
    SET reset_pin = ?, reset_expiration = DATE_ADD(NOW(), INTERVAL 10 MINUTE)
    WHERE correo = ?;
  `;

  connection.query(query, [hashedPin, correo], async (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Correo no encontrado" });

    // Enviar el correo con el PIN real
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

      res.json({ message: "PIN enviado al correo registrado" });
    } catch (error) {
      console.error("Error al enviar correo:", error);
      res.status(500).json({ error: "Error al enviar correo" });
    }
  });
};


// Verificar PIN
export const verifyPin = async (req, res) => {
  const { correo, pin } = req.body;

  if (!correo || !pin) {
    return res.status(400).json({ error: "Correo y PIN son requeridos" });
  }

  const query = "SELECT reset_pin, reset_expiration FROM usuario WHERE correo = ?";

  connection.query(query, [correo], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

    const user = results[0];

    // Comparar PIN con hash
    const pinValido = await bcrypt.compare(pin.toString(), user.reset_pin);
    if (!pinValido) return res.status(400).json({ error: "PIN incorrecto" });

    // Verificar expiración
    if (new Date() > new Date(user.reset_expiration)) {
      return res.status(400).json({ error: "PIN expirado, solicita uno nuevo" });
    }

    res.json({ message: "PIN válido" });
  });
};
