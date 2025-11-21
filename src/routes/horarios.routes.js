const express = require('express');
const router = express.Router();
const HorariosController = require('../controllers/horarios.controller');
const { verificarToken } = require('../middleware/auth.middleware');

// ============ RUTAS PÚBLICAS (solo lectura para clientes) ============
// GET /all (todos horarios globales)
router.get('/all', HorariosController.getAllHorarios);

// Nuevo: GET /date/:fecha (horarios por día para prefill edit)
router.get('/date/:fecha', HorariosController.getHorariosByDate);

// GET /profesional/:id (mantenido)
router.get('/profesional/:id', HorariosController.getHorariosByProfesional);

// ============ RUTAS PROTEGIDAS (requieren autenticación admin) ============
// POST /
router.post('/', verificarToken, HorariosController.createHorario);

// PUT /:id
router.put('/:id', verificarToken, HorariosController.updateHorario);

module.exports = router;