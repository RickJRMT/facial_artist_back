/**
 * middleware/errorHandler.js
 * 
 * Middleware centralizado para manejo de errores.
 * Reemplaza el que tenías directamente en app.js (más limpio y reutilizable)
 */

const errorHandler = (err, req, res, next) => {
    console.error('Error capturado:', err.stack || err);

    // Errores de Multer (subida de archivos)
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            ok: false,
            message: 'Archivo demasiado grande. Máximo permitido: 5MB'
        });
    }

    // Error de validación de JWT
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            ok: false,
            message: 'Token inválido'
        });
    }

    // Error de token expirado
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            ok: false,
            message: 'Sesión expirada. Por favor inicia sesión nuevamente'
        });
    }

    // Error por defecto
    res.status(err.status || 500).json({
        ok: false,
        message: err.message || 'Error interno del servidor'
    });
};

module.exports = { errorHandler };