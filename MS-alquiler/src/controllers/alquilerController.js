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
  


// Controlador para crear un alquiler (solo para "arrendatario")
exports.crearAlquiler = async (req, res) => {
    const { adminNombreUsuario, adminContrasena, id_prop, fecha_inicio } = req.body;

    try {
        // Verificar el rol de arrendatario y obtener id_arren
        const arrendatario = await verificarRol(adminNombreUsuario, adminContrasena, 'arrendatario');
        if (!arrendatario) {
            return res.status(403).json({ mensaje: 'Permiso denegado. Solo arrendatarios pueden realizar esta acción.' });
        }
        const id_arren = arrendatario.id; // Asigna el id del arrendatario

        // Obtener id_prop e id_hab de la propiedad
        try {
            const propiedadResponse = await axios.get(`http://localhost:3001/api/usuarios/${id_prop}`);
            const propiedad = propiedadResponse.data;

            // Asegurar que se obtuvieron los datos esperados de la propiedad
            if (!propiedad || !propiedad.id_hab || !propiedad.id_prop) {
                return res.status(404).json({ mensaje: 'Propiedad no encontrada o datos incompletos.' });
            }

            const id_hab = propiedad.id_hab; // Asigna el id de la habitación
            const id_prop_from_user = propiedad.id_prop; // Asigna el id del propietario desde el microservicio de usuario

            // Crear el alquiler con los IDs obtenidos (id_alq generado automáticamente por la base de datos)
            const nuevoAlquiler = await Alquiler.crearAlquiler(id_prop_from_user, id_arren, id_hab, fecha_inicio);

            // Comunicación con microservicio de propiedades para actualizar el estado de la habitación
            await axios.patch(`http://localhost:3001/api/propiedades/${id_hab}`, { estado: 'No Disponible' });

            // Enviar respuesta con los datos del nuevo alquiler creado
            res.status(201).json(nuevoAlquiler);
        } catch (error) {
            console.error("Error al obtener la propiedad:", error.message);
            res.status(500).json({ error: error.message });
        }
    } catch (error) {
        console.error("Error al crear el alquiler:", error.message);
        res.status(500).json({ error: error.message });
    }
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
