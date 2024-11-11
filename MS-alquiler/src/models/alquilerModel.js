const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuración de conexión a la base de datos de alquileres
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'alquileres_db',
});

// Función para crear un alquiler
exports.crearAlquiler = async (id_prop, nombre_prop, nombre_arren, fecha_inicio) => {
  const [result] = await pool.query(
    'INSERT INTO alquileres (id_prop, nombre_prop, nombre_arren, fecha_inicio) VALUES (?, ?, ?, ?)',
    [id_prop, nombre_prop, nombre_arren, fecha_inicio]
  );
  return { id: result.insertId, id_prop, nombre_prop, nombre_arren, fecha_inicio };
};

// Función para consultar todos los alquileres
exports.consultarAlquileres = async () => {
  const [rows] = await pool.query('SELECT * FROM alquileres');
  return rows;
};

// Función para consultar alquileres por propietario
exports.consultarAlquileresPorPropietario = async (id_prop) => {
  const [rows] = await pool.query('SELECT * FROM alquileres WHERE id_prop = ?', [id_prop]);
  return rows;
};
