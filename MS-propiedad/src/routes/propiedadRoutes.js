const express = require('express');
const propiedadController = require('../controllers/propiedadController');
const router = express.Router();

router.post('/propiedades', propiedadController.crearPropiedad); // Crear propiedad
router.get('/propiedades/disponibles', propiedadController.consultarPropiedadesDisponibles); // Consultar propiedades disponibles
router.delete('/propiedades/:id', propiedadController.eliminarPropiedad); // Eliminar propiedad

module.exports = router;
