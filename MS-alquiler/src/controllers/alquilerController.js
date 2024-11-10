const Alquiler = require('../models/alquilerModel');
const axios = require('axios');

// Función para verificar el rol mediante credenciales
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

// Controlador para crear un alquiler (solo para arrendatarios)
exports.crearAlquiler = async (req, res) => {

};


// Controlador para consultar todos los alquileres (solo para "administrador")
exports.consultarAlquileres = async (req, res) => {
    const { adminNombreUsuario, adminContrasena } = req.body;
  
    if (!await validarRol(adminNombreUsuario, adminContrasena, 'administrador')) {
      return res.status(403).json({ mensaje: 'Permiso denegado. Solo administradores pueden realizar esta acción.' });
    }
  
    try {
      const alquileres = await Alquiler.consultarAlquileres();
      res.status(200).json(alquileres);
    } catch (error) {
      console.error("Error al consultar alquileres:", error.message);
      res.status(500).json({ error: error.message });
    }
  };


// Controlador para consultar alquileres por propietario (solo para "propietario")
exports.consultarAlquileresPorPropietario = async (req, res) => {
    const { id_prop } = req.params;
    const { adminNombreUsuario, adminContrasena } = req.body;
  
    if (!await validarRol(adminNombreUsuario, adminContrasena, 'propietario')) {
      return res.status(403).json({ mensaje: 'Permiso denegado. Solo propietarios pueden realizar esta acción.' });
    }
  
    try {
      const alquileres = await Alquiler.consultarAlquileresPorPropietario(id_prop);
      res.status(200).json(alquileres);
    } catch (error) {
      console.error("Error al consultar alquileres por propietario:", error.message);
      res.status(500).json({ error: error.message });
    }
  };
