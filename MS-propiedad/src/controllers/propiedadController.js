const Propiedad = require('../models/propiedadModel');
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


// Controlador para crear una propiedad (solo para propietario)
exports.crearPropiedad = async (req, res) => {
  const { adminNombreUsuario, adminContrasena, ciudad, descripcion, costo, estado } = req.body;

  try {
      // Verificar el rol del usuario y obtener su id_usu
      const usuario = await verificarRol(adminNombreUsuario, adminContrasena, 'propietario');
      if (!usuario) {
          return res.status(403).json({ mensaje: 'Permiso denegado. Solo el propietario puede crear propiedades.' });
      }

      const id_prop = usuario.id; // Obtener el id_usu del usuario autenticado y autorizado

      // Crear la propiedad en la base de datos usando el id_prop del propietario autenticado
      const nuevaPropiedad = await Propiedad.crearHabitacion(ciudad, descripcion, id_prop, costo, estado);
      res.status(201).json(nuevaPropiedad);
  } catch (error) {
      console.error("Error al crear la propiedad:", error.message);
      res.status(500).json({ error: error.message });
  }
};


// Controlador para consultar propiedades disponibles (solo para arrendatarios)
exports.consultarPropiedadesDisponibles = async (req, res) => {
  const { adminNombreUsuario, adminContrasena } = req.body;

  if (!await verificarRol(adminNombreUsuario, adminContrasena, 'arrendatario')) {
    return res.status(403).json({ mensaje: 'Permiso denegado. Solo el arrendatario puede consultar propiedades disponibles.' });
  }

  try {
    const propiedades = await Propiedad.consultarHabitacionesDisponibles();
    res.status(200).json(propiedades);
  } catch (error) {
    console.error("Error al consultar propiedades disponibles:", error.message);
    res.status(500).json({ error: error.message });
  }
};


// Controlador para consultar propiedades disponibles por ID (ahora usando POST)
exports.consultarPropiedadDisponiblePorId = async (req, res) => {
  const { adminNombreUsuario, adminContraseña, id_hab } = req.body; // Usar req.body en lugar de req.params

  // Verificación del rol de arrendatario
  if (!await verificarRol(adminNombreUsuario, adminContraseña, 'arrendatario')) {
    return res.status(403).json({ mensaje: 'Permiso denegado. Solo el arrendatario puede consultar propiedades disponibles.' });
  }

  try {
    // Busca la propiedad específica por id_hab
    const propiedad = await Propiedad.consultarHabitacionDisponiblePorId(id_hab);
    if (!propiedad) {
      return res.status(404).json({ mensaje: 'Propiedad no encontrada o no está disponible.' });
    }
    res.status(200).json(propiedad);
  } catch (error) {
    console.error("Error al consultar propiedad disponible por ID:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Controlador para eliminar una propiedad (solo para propietario)
exports.eliminarPropiedad = async (req, res) => {
  const { id } = req.params;
  const { adminNombreUsuario, adminContrasena } = req.body;

  if (!await verificarRol(adminNombreUsuario, adminContrasena, 'propietario')) {
    return res.status(403).json({ mensaje: 'Permiso denegado. Solo el propietario puede eliminar propiedades.' });
  }

  try {
    await Propiedad.eliminarHabitacion(id);
    res.status(200).json({ mensaje: 'Propiedad eliminada correctamente' });
  } catch (error) {
    console.error("Error al eliminar la propiedad:", error.message);
    res.status(500).json({ error: error.message });
  }
};
