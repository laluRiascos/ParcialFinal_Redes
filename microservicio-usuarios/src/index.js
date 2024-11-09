const express = require('express');
const usuarioRoutes = require('./routes/usuarioRoutes.js');

const app = express();
app.use(express.json());

// Registrar rutas de usuarios
app.use('/api', usuarioRoutes);

app.listen(3000, () => {
    console.log('Microservicio de Usuarios ejecutándose en el puerto 3000');
});
