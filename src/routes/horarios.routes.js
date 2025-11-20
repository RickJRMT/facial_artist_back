const express = require('express');
const router = express.Router();
const HorariosController = require('../controllers/horarios.controller');

// GET /all (todos horarios globales)
router.get('/all', HorariosController.getAllHorarios);

// Nuevo: GET /date/:fecha (horarios por día para prefill edit)
router.get('/date/:fecha', HorariosController.getHorariosByDate);

// GET /profesional/:id (mantenido)
router.get('/profesional/:id', HorariosController.getHorariosByProfesional);

// POST /
router.post('/', HorariosController.createHorario);

// PUT /:id
router.put('/:id', HorariosController.updateHorario);

module.exports = router;