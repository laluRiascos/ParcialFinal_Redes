const express = require('express');
const propiedadRoutes = require('./routes/propiedadRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/api', require('./routes/propiedadRoutes'));

// Registrar las rutas para la entidad Propiedades
app.use('/api', propiedadRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Microservicio de Propiedades ejecutándose en el puerto ${PORT}`);
});
