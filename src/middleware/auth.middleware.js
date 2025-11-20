/**
 * middleware/auth.middleware.js
 * 
 * Middleware para proteger rutas que requieren autenticación.
 * Verifica que el token JWT sea válido y no haya expirado.
 * Si todo está bien, agrega los datos del usuario a req.user
 */

const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'natalia-facial-artist-2025-super-secreto';

/**
 * Middleware: verificarToken
 * Uso: app.use('/api/ruta-protegida', verificarToken, router)
 */
const verificarToken = (req, res, next) => {
    // Busca el token en los headers: Authorization: Bearer <token>
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            ok: false,
            message: 'Acceso denegado: Token no proporcionado o formato inválido'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        // payload contiene: { id, nombre, correo, role: 'admin', iat, exp }
        req.user = payload;
        next(); // Continúa hacia el controlador
    } catch (error) {
        return res.status(403).json({
            ok: false,
            message: 'Token inválido o expirado'
        });
    }
};

module.exports = { verificarToken };