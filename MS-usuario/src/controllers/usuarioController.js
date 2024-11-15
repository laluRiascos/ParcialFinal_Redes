const bcrypt = require('bcrypt');
const Usuario = require('../models/usuarioModel');

//Función para para crear un usuario (solo administradores)
exports.crearUsuario = async (req, res) => {
  const { usuarioAdmin, passwordAdmin, nombreCompleto, usuario, password, rol } = req.body;

  if (rol !== "administrador" && rol !== "propietario" && rol !== "arrendatario"){
    return res.status(404).json({ mensaje: 'El rol no es valido' });
}

  try {
    // Validar credenciales del administrador
    const adminUser = await Usuario.validarCredenciales(usuarioAdmin, passwordAdmin);

    if (!adminUser || adminUser.rol !== 'administrador') {
      return res.status(403).json({ error: 'Acceso denegado: Se requiere rol de administrador' });
    }

    // Si es administrador, continúa con la creación del usuario
    const nuevoUsuario = await Usuario.crearUsuario(nombreCompleto, usuario, password, rol);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error("Error al crear el usuario:", error.message);
    res.status(500).json({ error: error.message });
  }
};


// Función para consultar todos los usuarios (solo administradores)
exports.consultarUsuarios = async (req, res) => {
  const { usuarioAdmin, passwordAdmin } = req.body; // Recibe las credenciales de administrador desde los headers

  try {
    // Valida las credenciales del administrador
    const adminUser = await Usuario.validarCredenciales(usuarioAdmin, passwordAdmin);

    // Verifica si el usuario es administrador
    if (!adminUser || adminUser.rol !== 'administrador') {
      return res.status(403).json({ error: 'Acceso denegado: Se requiere rol de administrador' });
    }

    // Si es administrador, continúa con la consulta de todos los usuarios
    const usuarios = await Usuario.consultarUsuarios();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error al consultar usuarios:", error.message);
    res.status(500).json({ error: error.message });
  }
};


// Función para consultar un usuario por ID (solo administradores)
exports.consultarUsuarioPorId = async (req, res) => {
  const { id } = req.params;
  const { usuarioAdmin, passwordAdmin } = req.body; // Recibe las credenciales de administrador en el cuerpo

  try {
    // Valida credenciales del administrador
    const adminUser = await Usuario.validarCredenciales(usuarioAdmin, passwordAdmin);

    // Verifica si el usuario es administrador
    if (!adminUser || adminUser.rol !== 'administrador') {
      return res.status(403).json({ error: 'Acceso denegado: Se requiere rol de administrador' });
    }

    // Si es administrador, continúa con la consulta del usuario por ID
    const usuario = await Usuario.consultarUsuarioPorId(id);
    if (usuario) {
      res.status(200).json(usuario);
    } else {
      res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error("Error al consultar usuario por ID:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Controlador para validar credenciales
exports.validarCredenciales = async (req, res) => {
  console.log("Cuerpo de la solicitud (req.body):", req.body); 

  // Ajusta los nombres para coincidir con los datos en el req.body
  const { usuario, password } = req.body;

  try {
      console.log("Datos recibidos:", { usuario, password });

      // Consulta en la base de datos
      const user = await Usuario.validarCredenciales(usuario, password);
      
      if (user) {
          console.log("Credenciales válidas para el usuario:", user);
          res.status(200).json({ mensaje: 'Credenciales válidas', usuario: user });
      } else {
          console.log("Credenciales inválidas para el usuario:", usuario);
          res.status(401).json({ error: 'Credenciales inválidas' });
      }
  } catch (error) {
      console.error("Error al validar credenciales:", error.message);
      res.status(500).json({ error: error.message });
  }
};