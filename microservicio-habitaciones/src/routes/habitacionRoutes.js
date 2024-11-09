const express = require('express');
const router = express.Router();
const habitacionController = require('../controllers/habitacionController');

// Rutas para las habitaciones
router.post('/habitaciones', habitacionController.crearHabitacion);                  // Crear habitación
router.get('/habitaciones/:id', habitacionController.consultarHabitacion);           // Consultar una habitación específica
router.get('/habitaciones', habitacionController.consultarHabitacionesDisponibles);  // Consultar habitaciones disponibles
router.put('/habitaciones/:id', habitacionController.actualizarHabitacion);          // Actualizar habitación
router.delete('/habitaciones/:id', habitacionController.eliminarHabitacion);         // Eliminar habitación

module.exports = router;
