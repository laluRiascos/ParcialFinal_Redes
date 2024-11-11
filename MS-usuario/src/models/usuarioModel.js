const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Configuración de conexión a la base de datos de usuarios
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'usuarios_db'
});

// Función para crear un usuario
exports.crearUsuario = async (nombre_completo, usuario, password, rol) => {
  const [result] = await pool.query(
    'INSERT INTO usuarios (nombre_completo, usuario, password, rol) VALUES (?, ?, ?, ?)',
    [nombre_completo, usuario, password, rol]
  );
  return { id: result.insertId, nombre_completo, usuario, rol };
};

// Función para obtener todos los usuarios
exports.consultarUsuarios = async () => {
  const [rows] = await pool.query(`SELECT * FROM usuarios`);
  return rows;
};

// Función para obtener un usuario por ID
exports.consultarUsuarioPorId = async (id) => {
  const [rows] = await pool.query(`SELECT * FROM usuarios WHERE id_usu = ?`, [id]);
  return rows[0];
};

// Función para validar credenciales de un usuario
exports.validarCredenciales = async (usuario, password) => {
  console.log("Buscando usuario en la base de datos:", usuario);
  
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE usuario = ? AND password = ?', [usuario, password]);
  const user = rows[0];
  
  if (user) {
      console.log("Usuario encontrado en la base de datos:", user);
      return {
          id: user.id_usu,
          rol: user.rol,
          nombre_completo: user.nombre_completo
      };
  } else {
      console.log("No se encontró un usuario con las credenciales proporcionadas.");
      return null;
  }
};





