const habitacionModel = require('../models/habitacionModel');

// Crear una nueva habitación
exports.crearHabitacion = async (req, res) => {
    const { ciudad, descripcion, id_prop, costo, estado } = req.body;
    try {
        const nuevaHabitacion = await habitacionModel.crearHabitacion(ciudad, descripcion, id_prop, costo, estado);
        res.status(201).json(nuevaHabitacion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Consultar una habitación por ID
exports.consultarHabitacion = async (req, res) => {
    try {
        const habitacion = await habitacionModel.consultarHabitacion(req.params.id);
        if (habitacion) {
            res.json(habitacion);
        } else {
            res.status(404).json({ message: 'Habitación no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Consultar habitaciones disponibles
exports.consultarHabitacionesDisponibles = async (req, res) => {
    try {
        const habitaciones = await habitacionModel.consultarHabitacionesDisponibles();
        res.json(habitaciones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar una habitación
exports.actualizarHabitacion = async (req, res) => {
    const { ciudad, descripcion, costo, estado } = req.body;
    try {
        const resultado = await habitacionModel.actualizarHabitacion(req.params.id, ciudad, descripcion, costo, estado);
        res.json({ message: 'Habitación actualizada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar una habitación
exports.eliminarHabitacion = async (req, res) => {
    try {
        await habitacionModel.eliminarHabitacion(req.params.id);
        res.json({ message: 'Habitación eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
