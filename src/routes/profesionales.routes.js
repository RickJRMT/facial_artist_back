const express = require('express');
const router = express.Router();
const ProfesionalesController = require('../controllers/profesionales.controller');
const { verificarToken } = require('../middleware/auth.middleware');

// ============ RUTAS PÚBLICAS (solo lectura para clientes) ============
// GET / (todos, usando controller ahora para consistencia)
router.get('/', ProfesionalesController.getAll);

// GET /:id
router.get('/:id', ProfesionalesController.getById);

// ============ RUTAS PROTEGIDAS (requieren autenticación admin) ============
// POST /
router.post('/', verificarToken, ProfesionalesController.create);

// PUT /:id
router.put('/:id', verificarToken, ProfesionalesController.update);

// DELETE /:id
router.delete('/:id', verificarToken, ProfesionalesController.delete);

module.exports = router;