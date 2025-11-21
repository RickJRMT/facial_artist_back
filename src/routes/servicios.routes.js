// src/routes/servicios.routes.js
const express = require('express');
const router = express.Router();
const ServiciosController = require('../controllers/servicios.controller');
const { verificarToken } = require('../middleware/auth.middleware');

// ============ RUTAS PÚBLICAS (solo lectura para clientes) ============
// GET /api/servicios - Obtener todos los registros de Servicios
router.get('/', async (req, res) => {
    try {
        const servicios = await ServiciosController.obtenerTodos();
        res.json (servicios);
    } catch (error) {
        console.error('Error al obtener Servicios:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor' 
        });
    }
});

// GET /api/servicios/:id - Obtener un Servicio por ID
router.get('/:id', async (req, res) => {
    try {
        const servicio = await ServiciosController.obtenerPorId(req.params.id);
        if (!servicio) {
            return res.status(404).json({ 
                success: false, 
                message: 'Registro no encontrado' 
            });
        }
        res.json({ success: true, data: servicio });
    } catch (error) {
        console.error('Error al obtener Servicio por ID:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor' 
        });
    }
});

// ============ RUTAS PROTEGIDAS (requieren autenticación admin) ============
// POST /api/servicios - Crear un nuevo Servicio
router.post('/', verificarToken, async (req, res) => {
    try {
        // Validar campos requeridos
        const { servNombre, servDescripcion, servCosto, servDuracion } = req.body;
        if (!servNombre || !servDescripcion || !servCosto) {
            return res.status(400).json({ 
                success: false, 
                message: 'Faltan campos requeridos: servNombre, servDescripcion, servCosto' 
            });
        }
        
        // Validar que la duración sea un número positivo
        if (servDuracion && (isNaN(servDuracion) || servDuracion <= 0)) {
            return res.status(400).json({
                success: false,
                message: 'La duración del servicio debe ser un número positivo de minutos'
            });
        }

        // Nota: servImagen como Base64 opcional
        const data = { ...req.body };
        const newServicio = await ServiciosController.crear(data);
        res.status(201).json({ success: true, data: newServicio });
    } catch (error) {
        console.error('Error al crear Servicio:', error);
        res.status(400).json({ 
            success: false, 
            message: error.message || 'Error al crear el registro' 
        });
    }
});

// PUT /api/servicios/:id - Actualizar un Servicio por ID
router.put('/:id', verificarToken, async (req, res) => {
    try {
        // Nota: servImagen como Base64 opcional
        const data = { ...req.body };
        const updatedServicio = await ServiciosController.actualizar(req.params.id, data);
        if (!updatedServicio) {
            return res.status(404).json({ 
                success: false, 
                message: 'Registro no encontrado' 
            });
        }
        res.json({ success: true, data: updatedServicio });
    } catch (error) {
        console.error('Error al actualizar Servicio:', error);
        res.status(400).json({ 
            success: false, 
            message: error.message || 'Error al actualizar el registro' 
        });
    }
});

// DELETE /api/servicios/:id - Eliminar un Servicio por ID
router.delete('/:id', verificarToken, async (req, res) => {
    try {
        const result = await ServiciosController.eliminar(req.params.id);
        res.json({ success: true, message: result.mensaje });
    } catch (error) {
        console.error('Error al eliminar Servicio:', error);
        res.status(400).json({ 
            success: false, 
            message: error.message || 'Error al eliminar el registro' 
        });
    }
});

module.exports = router;