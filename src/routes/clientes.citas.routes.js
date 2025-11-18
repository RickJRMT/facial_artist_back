const express = require('express');

const router = express.Router();

const CrudControllerCitas = require('../controllers/citas_cliente.controller');
const crudgenericoController = require('../controllers/crud.controller');

// se crea una nueva instancia para utilizar los metodos 
const crudCitas = new CrudControllerCitas(); // Ahora CrudControllerCitas está definido

//se define el nombre de la tabla en la base de datos sobre la que se operará
const tabla = 'Citas';

//Se define el nombre del campo identificador único de la  tabla 
const idCampo = 'idCita';

//Ruta para obtener todos los registros de citas 
router.get('/', async (req, res) => {
    try {
        // Lee param para JOIN condicional (opcional, para futuro prefill)
        const includeCliente = req.query.includeCliente === 'true';
        const citas = await crudCitas.obtenerCitasConDetalles(includeCliente); // Usa método de instancia
        //Respuesta con el arreglo de personas en formato JSON
        res.json(citas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//ruta para obtener una cita especifica por su id
router.get('/:id', async (req, res) => {
    try {
        const cita = await crudgenericoController.obtenerTablaId(tabla, idCampo, req.params.id);
        //respuesta con los datos de la cita en formato JSON 
        res.json(cita);
    } catch (error) {
        //manejar errores de servidor
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const nuevaCita = await crudCitas.crearCita(req.body);
        res.status(201).json(nuevaCita);
    } catch (error) {
        console.error('Error en creación de cita:', error);
        res.status(500).json({ error: error.message });
    }
});

// Ruta para  actualizar una cita existente por id
router.put('/:id', async (req, res) => {
    try {
        const citaActualizada = await crudCitas.actualizarCita(req.params.id, req.body); // Usa método específico
        res.json(citaActualizada);
    } catch (error) {
        console.error('Error en PUT cita:', error.message, error.stack); // LOG en route
        res.status(500).json({ error: error.message });
    }
});

//ruta para eliminar una persona de la base de datos por id
router.delete('/:id', async (req, res) => {
    try {
        const resultado = await crudgenericoController.eliminar(tabla, idCampo, req.params.id);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Se creará esté endpoint para obtener los horarios disponibles 
router.post('/disponibilidad', async (req, res) => {
    try {
        const horarios = await crudCitas.obtenerHorariosDisponibles(req.body);
        res.json(horarios);
    } catch (error) {
        console.error('Error al obtener horarios disponibles:', error);
        res.status(500).json({ error: error.message });
    }
});
// Ruta para obtener la fecha de nacimiento de un cliente por celular
router.get('/fecha-nacimiento/:celular', async (req, res) => {
    try {
        const fecha = await crudCitas.obtenerFechaNacimientoPorCelular(req.params.celular);
        res.json({
            fechaNacCliente: fecha || null
        });
    } catch (error) {
        console.error('Error al obtener fecha de nacimiento:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/consultar', async (req, res) => {
    try {
        const cita = await crudCitas.consultarCitaPorTelefonoYReferencia(req.body);
        if (!cita) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }
        res.json(cita);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/referencia/:ref', async (req, res) => {
    try {
        const cita = await crudCitas.consultarCitaPorReferencia(req.params.ref);
        if (!cita) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }
        res.json(cita);
    } catch (error) {
        console.error('Error en /referencia:', error);
        res.status(500).json({ error: error.message });
    }
});

// Ruta DELETE actualizada para usar método específico de eliminación
router.delete('/:id', async (req, res) => {
    try {
        const resultado = await crudCitas.eliminarCita(req.params.id);
        res.json(resultado);
    } catch (error) {
        console.error('Error detallado al eliminar cita en ruta:', error.message, error.stack); // Log con stack
        if (error.message.includes('No se encontró')) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

module.exports = router;