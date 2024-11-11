const express = require('express');
const habitacionRoutes = require('./routes/habitacionRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/api', habitacionRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Microservicio de Habitaciones ejecutándose en el puerto ${PORT}`);
});
