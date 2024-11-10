const express = require('express');
const usuarioModel = require('./models/usuarioModel');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/api', require('./routes/usuarioRoutes'));

// Datos del usuario administrador inicial
const adminDatos = {
  nombreCompleto: 'Laura Riascos',
  nombreUsuario: 'laura_admin',
  contrasena: '3135282822',
  rol: 'administrador'
};

// Función para verificar y crear un usuario administrador inicial
async function crearAdminInicial() {
  try {
    // Verificar si el usuario ya existe usando el nombre de usuario
    const adminExistente = await usuarioModel.validarCredenciales(adminDatos.nombreUsuario, adminDatos.contrasena);
    
    if (!adminExistente) {
      // Si no existe, crear el usuario administrador
      await usuarioModel.crearUsuario(
        adminDatos.nombreCompleto,
        adminDatos.nombreUsuario,
        adminDatos.contrasena,  // Guardar contraseña sin encriptar
        adminDatos.rol
      );
      console.log('Usuario administrador inicial creado.');
    } else {
      console.log('El usuario administrador ya existe.');
    }
  } catch (error) {
    console.error('Error al crear el usuario administrador:', error.message);
  }
}

// Llamar a la función al iniciar el servidor
crearAdminInicial();

// Registrar rutas de usuarios
app.use('/api', require('./routes/usuarioRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Microservicio de Usuarios ejecutándose en el puerto ${PORT}`);
});
