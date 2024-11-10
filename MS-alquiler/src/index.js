const express = require('express');
const alquilerRoutes = require('./routes/alquilerRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/api', require('./routes/alquilerRoutes'));

// Registrar las rutas para la entidad Alquileres
app.use('/api', alquilerRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Microservicio de Alquileres ejecutándose en el puerto ${PORT}`);
});
