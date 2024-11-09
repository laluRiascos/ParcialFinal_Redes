const express = require('express');
const habitacionRoutes = require('./routes/habitacionRoutes');

const app = express();
app.use(express.json());

// Registrar rutas de habitaciones
app.use('/api', habitacionRoutes);

app.listen(3001, () => {
    console.log('Microservicio de Habitaciones ejecutándose en el puerto 3001');
});
