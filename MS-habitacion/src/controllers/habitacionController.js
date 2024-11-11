const Habitaciones = require('../models/habitacionModel');
const axios = require('axios');

// Función con axios para verificar el rol mediante credenciales
async function verificarRol(nombreUsuario, contrasena, rolNecesario) {
  try {
      // Imprime los datos antes de la solicitud
      console.log("Enviando datos:", { nombreUsuario, contrasena });

      const response = await axios.post('http://localhost:3000/api/usuarios/validar', {
          usuario: nombreUsuario, // Cambiado a 'usuario' si es lo que espera el controlador
          password: contrasena    // Cambiado a 'password' si es lo que espera el controlador
      });

      // Imprime la respuesta completa si la solicitud es exitosa
      console.log("Respuesta recibida:", response.data);

      // Comprueba si response.data contiene usuario antes de acceder a él
      const usuario = response.data.usuario;

      if (usuario && usuario.rol === rolNecesario) {
          return usuario; // Devuelve el objeto usuario completo, incluyendo el id
      } else {
          console.error("Rol no coincide o usuario no encontrado.");
          return null; // Devuelve null si el rol no coincide
      }
  } catch (error) {
      // Imprime detalles adicionales del error
      if (error.response) {
          console.error("Error al verificar rol:", error.response.status, error.response.data);
      } else {
          console.error("Error al verificar rol:", error.message);
      }
      return null; // Devuelve null en caso de error
  }
}

// Función para crear una habitacion (solo propietario)
exports.crearHabitacion = async (req, res) => {
    const { usuarioProp, passwordProp, ciudad, descripcion, costo, estado } = req.body;

    try {
        // 1. Verificar el rol del usuario y obtener su id y nombre completo
        const usuario = await verificarRol(usuarioProp, passwordProp, 'propietario');
        
        if (!usuario) {
            return res.status(403).json({ mensaje: 'Permiso denegado. Solo el propietario puede crear habitaciones.' });
        }

        // Extraer id y nombre completo del usuario autenticado
        const id_prop = usuario.id;  // ID del propietario
        const nombre_prop = usuario.nombre_completo;  // Nombre completo del propietario

        // 2. Crear la habitación en la base de datos
        const nuevaHabitacion = await Habitaciones.crearHabitacion(ciudad, descripcion, id_prop, nombre_prop, costo, estado);

        res.status(201).json(nuevaHabitacion);
    } catch (error) {
        console.error("Error al crear la habitación:", error.message);
        res.status(500).json({ error: error.message });
    }
};


// Función para consultar todas las habitaciones disponibles (solo arrendatario)
exports.consultarHabitacionesDisponibles = async (req, res) => {
  const { usuario, password } = req.body;

  if (!await verificarRol(usuario, password, 'arrendatario')) {
      return res.status(403).json({ mensaje: 'Permiso denegado. Solo el arrendatario puede consultar habitaciones disponibles.' });
  }

  try {
      const habitaciones = await Habitaciones.consultarHabitacionesDisponibles();
      res.status(200).json(habitaciones);
  } catch (error) {
      console.error("Error al consultar habitaciones disponibles:", error.message);
      res.status(500).json({ error: error.message });
  }
};


// Función para consultar una habitacion por ID (solo arrendatario)
exports.consultarHabitacionDisponiblePorId = async (req, res) => {
  const { usuario, password } = req.body; // Obtener usuario y contraseña
  const id_hab = req.params.id_hab; // Obtener id_hab de los params

  if (!await verificarRol(usuario, password, 'arrendatario')) {
      return res.status(403).json({ mensaje: 'Permiso denegado. Solo el arrendatario puede consultar habitaciones disponibles.' });
  }

  try {
      const habitacion = await Habitaciones.consultarHabitacionDisponiblePorId(id_hab);
      if (!habitacion) {
          return res.status(404).json({ mensaje: 'Habitación no encontrada o no está disponible.' });
      }
      res.status(200).json(habitacion);
  } catch (error) {
      console.error("Error al consultar habitación disponible por ID:", error.message);
      res.status(500).json({ error: error.message });
  }
};

// Función para actualizar el estado de una habitación a "No Disponible" (solo arrendatario)
exports.actualizarHabitacion = async (req, res) => {
    const { usuario, password, estado } = req.body; // Obtener usuario y contraseña del cuerpo de la solicitud
    const id_hab = req.params.id_hab; // Obtener id_hab de los params
  
    if (estado !== "Disponible" && estado !== "No Disponible"){
        return res.status(404).json({ mensaje: 'El estado no es valido' });
    }

    try {
      // Verificar el rol del usuario y asegurarse de que es arrendatario
      const usuarioVerificado = await verificarRol(usuario, password, 'arrendatario');
      if (!usuarioVerificado) {
        return res.status(403).json({ mensaje: 'Permiso denegado. Solo el arrandatario puede actualizar el estado de la habitación.' });
      }
  
      // Consultar si la habitación existe y está disponible
      const habitacion = await Habitaciones.consultarHabitacionDisponiblePorId(id_hab);
      if (!habitacion) {
        return res.status(404).json({ mensaje: 'Habitación no encontrada o ya está ocupada.' });
      }
  
      // Actualizar el estado de la habitación a "No Disponible"
      const habitacionActualizada = await Habitaciones.actualizarEstadoHabitacion(id_hab, estado);
  
      res.status(200).json({ mensaje: 'Estado de la habitación actualizado a No Disponible', habitacion: habitacionActualizada });
    } catch (error) {
      console.error("Error al actualizar el estado de la habitación:", error.message);
      res.status(500).json({ error: error.message });
    }
  };
  