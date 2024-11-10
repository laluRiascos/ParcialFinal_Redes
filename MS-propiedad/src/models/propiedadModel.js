const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuración de conexión a la base de datos de propiedades
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'propiedades_db',
});

// Función para crear una propiedad
exports.crearHabitacion = async (ciudad, descripcion, id_prop, costo, estado) => {
  const [result] = await pool.query(
    'INSERT INTO habitaciones (ciudad, descripcion, id_prop, costo, estado) VALUES (?, ?, ?, ?, ?)',
    [ciudad, descripcion, id_prop, costo, estado]
  );
  return { id: result.insertId, ciudad, descripcion, id_prop, costo, estado };
};

// Función para consultar propiedades disponibles
exports.consultarHabitacionesDisponibles = async () => {
  const [rows] = await pool.query('SELECT * FROM habitaciones WHERE estado = "Disponible"');
  return rows;
};

// Función en el modelo Propiedad para consultar una propiedad disponible por id_hab
exports.consultarHabitacionDisponiblePorId = async (id_hab) => {
  try {
    const [propiedad] = await pool.query(
      'SELECT * FROM habitaciones WHERE id_hab = ? AND estado = "Disponible"', 
      [id_hab]
    );
    return propiedad || null;
  } catch (error) {
    throw error;
  }
};

// Función para eliminar una propiedad por ID
exports.eliminarHabitacion = async (id) => {
  await pool.query('DELETE FROM habitaciones WHERE id_hab = ?', [id]);
};

