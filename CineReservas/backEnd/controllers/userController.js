import connection from "../db/connection.js";

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

    // Comparación directa. Te recomiendo luego usar bcrypt.
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
