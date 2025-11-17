const db = require('../config/conexion.db');

class CursosController {
    // Obtener todos los registros de Cursos
    async obtenerTodos() {
        try {
            const [resultado] = await db.query('SELECT * FROM Cursos');
            // Convertir cursoImagen de Buffer a Base64 para el frontend
            return resultado.map(curso => ({
                ...curso,
                cursoImagen: curso.cursoImagen ? curso.cursoImagen.toString('base64') : null
            }));
        } catch (error) {
            throw error;
        }
    }

    // Obtener un registro de Cursos por ID
    async obtenerPorId(id) {
        try {
            const [resultado] = await db.query('SELECT * FROM Cursos WHERE idCurso = ?', [id]);
            if (resultado[0]) {
                // Convertir cursoImagen de Buffer a Base64
                return {
                    ...resultado[0],
                    cursoImagen: resultado[0].cursoImagen ? resultado[0].cursoImagen.toString('base64') : null
                };
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    // Crear un nuevo registro en Cursos
    async crear(data) {
        try {
            // Convertir cursoImagen de Base64 (string desde frontend) a Buffer para MySQL
            const cursoImagen = data.cursoImagen ? Buffer.from(data.cursoImagen, 'base64') : null;
            const [resultado] = await db.query(
                'INSERT INTO Cursos (nombreCurso, cursoDescripcion, cursoDuracion, cursoCosto, cursoImagen) VALUES (?, ?, ?, ?, ?)',
                [data.nombreCurso, data.cursoDescripcion, data.cursoDuracion, data.cursoCosto, cursoImagen]
            );
            // Retorna el registro creado con el nuevo ID (cursoImagen como Base64 para consistencia)
            const nuevoId = resultado.insertId;
            return { ...data, idCurso: nuevoId, cursoImagen: data.cursoImagen || null };
        } catch (error) {
            throw error;
        }
    }

    // Actualizar un registro en Cursos por ID
    async actualizar(id, data) {
        try {
            const existing = await this.obtenerPorId(id);
            if (!existing) {
                throw new Error('Registro no encontrado');
            }
            // Convertir cursoImagen de Base64 a Buffer si se proporciona
            const cursoImagen = data.cursoImagen ? Buffer.from(data.cursoImagen, 'base64') : null;
            const [resultado] = await db.query(
                'UPDATE Cursos SET nombreCurso = ?, cursoDescripcion = ?, cursoDuracion = ?, cursoCosto = ?, cursoImagen = ? WHERE idCurso = ?',
                [data.nombreCurso, data.cursoDescripcion, data.cursoDuracion, data.cursoCosto, cursoImagen, id]
            );
            if (resultado.affectedRows === 0) {
                throw new Error('No se pudo actualizar el registro');
            }
            // Retorna el registro actualizado
            return await this.obtenerPorId(id);
        } catch (error) {
            throw error;
        }
    }

    // Eliminar un registro de Cursos por ID
    async eliminar(id) {
        try {
            const [resultado] = await db.query('DELETE FROM Cursos WHERE idCurso = ?', [id]);
            if (resultado.affectedRows === 0) {
                throw new Error('Registro no encontrado');
            }
            return { mensaje: 'Registro eliminado exitosamente' };
        } catch (error) {
            throw error;
        }
    }
}

// Funciones para compatibilidad con las rutas existentes
const crearCurso = async (req, res) => {
    try {
        const { nombreCurso, cursoDescripcion, cursoDuracion, cursoCosto, imagenBase64 } = req.body;

        if (!nombreCurso) {
            return res.status(400).json({ message: 'El nombre del curso es requerido' });
        }

        if (cursoDuracion && cursoDuracion.length > 50) {
            return res.status(400).json({ message: 'La duración del curso no debe superar los 50 caracteres' });
        }

        if (cursoCosto && cursoCosto < 0) {
            return res.status(400).json({ message: 'El costo no debe ser negativo' });
        }

        const cursosController = new CursosController();
        const data = {
            nombreCurso,
            cursoDescripcion,
            cursoDuracion,
            cursoCosto,
            cursoImagen: imagenBase64
        };

        const curso = await cursosController.crear(data);
        return res.status(201).json(curso);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al crear el curso', detalles: error.message });
    }
};

const obtenerCurso = async (req, res) => {
    try {
        const cursosController = new CursosController();
        const cursos = await cursosController.obtenerTodos();
        return res.status(200).json(cursos);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener los cursos', detalles: error.message });
    }
};

const obtenerCursoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const cursosController = new CursosController();
        const curso = await cursosController.obtenerPorId(id);
        
        if (!curso) {
            return res.status(404).json({ message: 'Curso no encontrado' });
        }
        
        return res.status(200).json(curso);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener el curso', detalles: error.message });
    }
};

const actualizarCurso = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombreCurso, cursoDescripcion, cursoDuracion, cursoCosto, imagenBase64 } = req.body;

        if (!nombreCurso) {
            return res.status(400).json({ message: 'El nombre del curso es requerido' });
        }

        if (cursoDuracion && cursoDuracion.length > 50) {
            return res.status(400).json({ message: 'La duración del curso no debe superar los 50 caracteres' });
        }

        if (cursoCosto && cursoCosto < 0) {
            return res.status(400).json({ message: 'El costo no debe ser negativo' });
        }

        const cursosController = new CursosController();
        const data = {
            nombreCurso,
            cursoDescripcion,
            cursoDuracion,
            cursoCosto,
            cursoImagen: imagenBase64
        };

        const curso = await cursosController.actualizar(id, data);
        return res.status(200).json(curso);
        
    } catch (error) {
        console.error('Error al actualizar el curso:', error);
        if (error.message === 'Registro no encontrado') {
            return res.status(404).json({ message: 'Curso no encontrado' });
        }
        return res.status(500).json({ message: 'Error al actualizar el curso', detalles: error.message });
    }
};

const eliminarCurso = async (req, res) => {
    try {
        const { id } = req.params;
        const cursosController = new CursosController();
        const result = await cursosController.eliminar(id);
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        if (error.message === 'Registro no encontrado') {
            return res.status(404).json({ error: 'Curso no encontrado' });
        }
        return res.status(500).json({ error: 'Error al eliminar el curso', detalles: error.message });
    }
};

module.exports = new CursosController();
// Exportar también las funciones individuales para compatibilidad con las rutas
module.exports.crearCurso = crearCurso;
module.exports.obtenerCurso = obtenerCurso;
module.exports.obtenerCursoPorId = obtenerCursoPorId;
module.exports.actualizarCurso = actualizarCurso;
module.exports.eliminarCurso = eliminarCurso;