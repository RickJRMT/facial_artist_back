const express = require('express');
const router = express.Router();
const ProfesionalesController = require('../controllers/profesionales.controller');

// GET / (todos, usando controller ahora para consistencia)
router.get('/', ProfesionalesController.getAll);

// GET /:id
router.get('/:id', ProfesionalesController.getById);

// POST /
router.post('/', ProfesionalesController.create);

// PUT /:id
router.put('/:id', ProfesionalesController.update);

// DELETE /:id
router.delete('/:id', ProfesionalesController.delete);

module.exports = router;