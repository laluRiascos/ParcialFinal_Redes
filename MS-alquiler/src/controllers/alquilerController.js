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

// Controlador para crear un alquiler
exports.crearAlquiler = async (req, res) => {
  const { nombre_arren, contrasena, id_hab, fecha_inicio } = req.body;

  try {
      // 1. Validar que el usuario que realiza la solicitud es un arrendatario
      const usuario = await verificarRol(nombre_arren, contrasena, 'arrendatario');
      if (!usuario) {
          return res.status(403).json({ mensaje: 'Permiso denegado. Solo un arrendatario puede crear un alquiler.' });
      }

      // 2. Realizar la solicitud a la entidad Habitacion para verificar si la habitación está disponible
      const propiedadResponse = await axios.post(`http://localhost:3001/api/habitacion/disponible/${id_hab}`, {
        usuario: nombre_arren,
        password: contrasena,
      });

      const propiedad = propiedadResponse.data[0];
      console.log(propiedad) 

      if (!propiedad) {
          return res.status(404).json({ mensaje: 'Propiedad o habitación no encontrada o no disponible.' });
      }

      // Guardar el nuevo alquiler en la base de datos
      const alquilerGuardado = await Alquiler.crearAlquiler(propiedad.id_prop, propiedad.nombre_prop, nombre_arren, fecha_inicio);
      const propiedadEstado = await axios.put(`http://localhost:3001/api/habitacion/estado/${id_hab}`, {
        usuario: nombre_arren,
        password: contrasena,
        estado: "No Disponible",
      });

      res.status(201).json({alquilerGuardado,propiedad:propiedadEstado.data});

  } catch (error) {
      console.error("Error al crear el alquiler:", error.message);
      res.status(500).json({ error: error.message });
  }
};

// Controlador para consultar todos los alquileres (solo para "administrador")
exports.consultarAlquileres = async (req, res) => {
    const { usuarioAdmin, passwordAdmin } = req.body;
  
    if (!await verificarRol(usuarioAdmin, passwordAdmin, 'administrador')) {
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
    const { usuarioProp, passwordProp } = req.body;
  
    if (!await verificarRol(usuarioProp, passwordProp, 'propietario')) {
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
