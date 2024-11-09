const usuarioModel = require('../models/usuarioModel');
const bcrypt = require('bcrypt');

// Función para crear un usuario (solo administrador)
exports.crearUsuario = async (req, res) => {
    const { nombre_completo, usuario, password, rol } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const nuevoUsuario = await usuarioModel.crearUsuario(nombre_completo, usuario, hashedPassword, rol);
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Función para consultar un usuario por ID
exports.consultarUsuario = async (req, res) => {
    try {
        const usuario = await usuarioModel.consultarUsuario(req.params.id);
        if (usuario) {
            res.json(usuario);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Función para actualizar un usuario
exports.actualizarUsuario = async (req, res) => {
    const { nombre_completo, usuario, password, rol } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const resultado = await usuarioModel.actualizarUsuario(req.params.id, nombre_completo, usuario, hashedPassword, rol);
        res.json({ message: 'Usuario actualizado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Función para eliminar un usuario
exports.eliminarUsuario = async (req, res) => {
    try {
        await usuarioModel.eliminarUsuario(req.params.id);
        res.json({ message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Validar credenciales
exports.validarCredenciales = async (req, res) => {
    const { usuario, password } = req.body;
    try {
        const user = await usuarioModel.consultarPorUsuario(usuario);
        if (user && await bcrypt.compare(password, user.password)) {
            res.json({ id: user.id_usu, rol: user.rol });
        } else {
            res.status(401).json({ message: 'Credenciales inválidas' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
