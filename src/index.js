require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB } = require('./db');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/clientes', require('./routes/clientes'));
app.use('/api/piezas',   require('./routes/piezas'));
app.use('/api/ordenes',  require('./routes/ordenes'));

// Health check
app.get('/', (req, res) => res.json({ status: 'TallerControl API corriendo ✅' }));

const PORT = process.env.PORT || 3000;

// Iniciar DB y luego el servidor
initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error al conectar a la base de datos:', err);
    process.exit(1);
  });
