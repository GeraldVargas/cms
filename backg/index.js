const express = require('express');
const cors = require('cors');
require('dotenv').config(); 
const conectarDB = require('./src/config/db');

conectarDB();

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
};

app.use(cors(corsOptions)); 
app.use(express.json()); 
app.use('/uploads', express.static('uploads'));


app.use('/api/noticias', require('./src/routes/noticiaRoutes'));
app.use('/api/actividades', require('./src/routes/actividadRoutes'));
app.use('/api/auth', require('./src/routes/authRoutes'));

app.get('/api/prueba', (req, res) => {
  res.json({ mensaje: "¡Hola! El backend y la base de datos están listos 🚀" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});