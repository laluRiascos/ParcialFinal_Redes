const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Definición de endpoints para Usuarios
router.post('/usuarios', usuarioController.crearUsuario);       // Crear usuario
router.get('/usuarios/:id', usuarioController.consultarUsuario); // Consultar usuario
router.put('/usuarios/:id', usuarioController.actualizarUsuario); // Actualizar usuario
router.delete('/usuarios/:id', usuarioController.eliminarUsuario); // Eliminar usuario
router.post('/usuarios/validar', usuarioController.validarCredenciales); // Validar credenciales

module.exports = router;
