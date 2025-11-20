/**
 * middleware/index.js
 * 
 * Archivo barril: exporta todos los middlewares en un solo lugar.
 * Uso en otros archivos: const { verificarToken, errorHandler } = require('../middleware');
 */

const { verificarToken } = require('./auth.middleware');
const { errorHandler } = require('./errorHandler');
// Aquí agregarás más en el futuro: uploads, validateBody, etc.

module.exports = {
    verificarToken,
    errorHandler
    // uploads, etc.
};