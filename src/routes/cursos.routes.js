// src/routes/cursos.routes.js
const express = require('express');
const router = express.Router();
const cursosController = require('../controllers/cursos.controller');
const { verificarToken } = require('../middleware/auth.middleware');

// ============ RUTAS PÚBLICAS (solo lectura para clientes) ============
// GET /api/cursos - Obtener todos los cursos
router.get('/', async (req, res) => {
    try {
        await cursosController.obtenerCurso(req, res);
    } catch (error) {
        console.error('Error en ruta GET /cursos:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor' 
        });
    }
});

// GET /api/cursos/:id - Obtener un curso por ID
router.get('/:id', async (req, res) => {
    try {
        await cursosController.obtenerCursoPorId(req, res);
    } catch (error) {
        console.error('Error en ruta GET /cursos/:id:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor' 
        });
    }
});

// ============ RUTAS PROTEGIDAS (requieren autenticación admin) ============
// POST /api/cursos - Crear un nuevo curso
router.post('/', verificarToken, async (req, res) => {
    try {
        // Validar campos requeridos
        const { nombreCurso } = req.body;
        if (!nombreCurso) {
            return res.status(400).json({ 
                success: false, 
                message: 'El nombre del curso es requerido' 
            });
        }

        await cursosController.crearCurso(req, res);
    } catch (error) {
        console.error('Error en ruta POST /cursos:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor' 
        });
    }
});

// PUT /api/cursos/:id - Actualizar un curso por ID
router.put('/:id', verificarToken, async (req, res) => {
    try {
        await cursosController.actualizarCurso(req, res);
    } catch (error) {
        console.error('Error en ruta PUT /cursos/:id:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor' 
        });
    }
});

// DELETE /api/cursos/:id - Eliminar un curso por ID
router.delete('/:id', verificarToken, async (req, res) => {
    try {
        await cursosController.eliminarCurso(req, res);
    } catch (error) {
        console.error('Error en ruta DELETE /cursos/:id:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor' 
        });
    }
});

module.exports = router;