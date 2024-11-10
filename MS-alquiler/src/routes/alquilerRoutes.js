const express = require('express');
const alquilerController = require('../controllers/alquilerController');
const router = express.Router();

router.post('/alquileres', alquilerController.crearAlquiler); // Crear alquiler
router.get('/alquileres', alquilerController.consultarAlquileres); // Consultar todos los alquileres
router.get('/alquileres/propietario/:id_prop', alquilerController.consultarAlquileresPorPropietario); // Consultar alquileres por propietario

module.exports = router;
