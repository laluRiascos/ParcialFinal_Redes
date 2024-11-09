const mysql = require('mysql2/promise');

// Configuración de conexión a la base de datos de usuarios
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'usuarios_db'
});

// Función para crear un usuario
exports.crearUsuario = async (nombre_completo, usuario, password, rol) => {
    const [result] = await pool.query('INSERT INTO usuarios (nombre_completo, usuario, password, rol) VALUES (?, ?, ?, ?)', 
                                      [nombre_completo, usuario, password, rol]);
    return { id: result.insertId, nombre_completo, usuario, rol };
};

// Función para consultar un usuario por ID
exports.consultarUsuario = async (id) => {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE id_usu = ?', [id]);
    return rows[0];
};

// Función para actualizar un usuario
exports.actualizarUsuario = async (id, nombre_completo, usuario, password, rol) => {
    const [result] = await pool.query('UPDATE usuarios SET nombre_completo = ?, usuario = ?, password = ?, rol = ? WHERE id_usu = ?', 
                                      [nombre_completo, usuario, password, rol, id]);
    return result;
};

// Función para eliminar un usuario
exports.eliminarUsuario = async (id) => {
    const [result] = await pool.query('DELETE FROM usuarios WHERE id_usu = ?', [id]);
    return result;
};

// Función para consultar un usuario por nombre de usuario
exports.consultarPorUsuario = async (usuario) => {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);
    return rows[0];
};
