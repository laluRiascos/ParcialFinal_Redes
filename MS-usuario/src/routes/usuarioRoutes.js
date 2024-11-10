const express = require('express');
const usuarioController = require('../controllers/usuarioController');
const router = express.Router();

router.post('/usuarios/validar', usuarioController.validarCredenciales); // Validar credenciales
router.post('/usuarios', usuarioController.crearUsuario); // Crear usuario
router.get('/usuarios', usuarioController.consultarUsuarios); // Obtener todos los usuarios
router.get('/usuarios/:id', usuarioController.consultarUsuarioPorId); // Consultar usuario por ID
router.delete('/usuarios/:id', usuarioController.eliminarUsuario); // Eliminar usuario

module.exports = router;