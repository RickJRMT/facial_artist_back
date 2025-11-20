const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware');

const app = express();

// ============ MIDDLEWARES GLOBALES ============
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ============ RUTAS PÚBLICAS (sin autenticación) ============
app.use('/api/imagenes', require('./routes/imagenes.routes'));
app.use('/api/cursos', require('./routes/cursos.routes'));
app.use('/api/servicios', require('./routes/servicios.routes'));
app.use('/api/cliente', require('./routes/clientes.routes'));
app.use('/api/citas', require('./routes/clientes.citas.routes'));
app.use('/api/horarios', require('./routes/horarios.routes'));

// ============ RUTA DE AUTENTICACIÓN ============
app.use('/api/auth', require('./routes/auth.routes')); // ← NUEVA RUTA

// ============ RUTAS PROTEGIDAS (solo admin) ============
const { verificarToken } = require('./middleware');

app.use('/api/adminCitas', verificarToken, require('./routes/admin.citas.routes'));
app.use('/api/hv', verificarToken, require('./routes/hv.routes'));
app.use('/api/profesional', verificarToken, require('./routes/profesionales.routes'));
app.use('/api/citas-profesional', verificarToken, require('./routes/citas_profesional.routes'));

// ============ MANEJO GLOBAL DE ERRORES (siempre al final) ============
app.use(errorHandler);

module.exports = app;