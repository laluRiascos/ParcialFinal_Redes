const mysql = require('mysql2/promise');

// Configuración de conexión a la base de datos de habitaciones
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',          // Cambia esto si usas otro usuario
    password: '',  // Cambia esto si tienes una contraseña configurada
    database: 'habitaciones_db'  // Nombre de la base de datos de habitaciones
});

// Crear una nueva habitación
exports.crearHabitacion = async (ciudad, descripcion, id_prop, costo, estado) => {
    const [result] = await pool.query(
        'INSERT INTO habitaciones (ciudad, descripcion, id_prop, costo, estado) VALUES (?, ?, ?, ?, ?)',
        [ciudad, descripcion, id_prop, costo, estado]
    );
    return { id: result.insertId, ciudad, descripcion, id_prop, costo, estado };
};

// Consultar una habitación por ID
exports.consultarHabitacion = async (id) => {
    const [rows] = await pool.query('SELECT * FROM habitaciones WHERE id_hab = ?', [id]);
    return rows[0];
};

// Consultar todas las habitaciones disponibles
exports.consultarHabitacionesDisponibles = async () => {
    const [rows] = await pool.query('SELECT * FROM habitaciones WHERE estado = "disponible"');
    return rows;
};

// Actualizar una habitación
exports.actualizarHabitacion = async (id, ciudad, descripcion, costo, estado) => {
    const [result] = await pool.query(
        'UPDATE habitaciones SET ciudad = ?, descripcion = ?, costo = ?, estado = ? WHERE id_hab = ?',
        [ciudad, descripcion, costo, estado, id]
    );
    return result;
};

// Eliminar una habitación
exports.eliminarHabitacion = async (id) => {
    const [result] = await pool.query('DELETE FROM habitaciones WHERE id_hab = ?', [id]);
    return result;
};
