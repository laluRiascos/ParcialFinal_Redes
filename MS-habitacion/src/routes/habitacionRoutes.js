const express = require('express');
const habitacionController = require('../controllers/habitacionController');
const router = express.Router();

router.post('/habitacion', habitacionController.crearHabitacion); // Crear habitación
router.get('/habitaciones/disponibles', habitacionController.consultarHabitacionesDisponibles); // Consultar habitaciones disponibles
router.post('/habitacion/disponible/:id_hab', habitacionController.consultarHabitacionDisponiblePorId); // Consultar habitación específica por ID
router.put('/habitacion/estado/:id_hab', habitacionController.actualizarHabitacion);

module.exports = router;

