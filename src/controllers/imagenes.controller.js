// Importar la conexión a la base de datos desde el archivo de configuración
const db = require('../config/conexion.db');

// Crear la clase ImagenesController que manejará las operaciones relacionadas con imágenes
class ImagenesController {

    // Método para subir o actualizar una imagen codificada en base64 a un registro específico
    async subirImagen(tabla, campoId, id, imagenBase64) {
        try {
            // Consultar si el registro con el ID existe
            const [registro] = await db.query(`SELECT * FROM ?? WHERE ?? = ?`, [tabla, campoId, id]);

            // Si no existe, retornar un error
            if (registro.length === 0) {
                return { error: 'No se encontró el registro con el ID proporcionado.' };
            }

            // Convertimos la imagen de base64 a un buffer (formato binario)
            const bufferImagen = Buffer.from(imagenBase64, 'base64');

            // Determinar el nombre del campo de imagen según la tabla
            let campoImagen = 'imagen'; // Por defecto
            if (tabla === 'Servicios') {
                campoImagen = 'servImagen';
            } else if (tabla === 'Cursos') {
                campoImagen = 'cursoImagen';
            } else if (tabla === 'Hv') {
                campoImagen = 'hvImagenAntes'; // o 'hvImagenDespues' según se necesite
            }

            // Crear la consulta para actualizar el campo imagen del registro
            const query = `UPDATE ?? SET ?? = ? WHERE ?? = ?`;
            const [result] = await db.query(query, [tabla, campoImagen, bufferImagen, campoId, id]);

            // Validar si la actualización fue exitosa
            if (result.affectedRows > 0) {
                return { message: 'Imagen actualizada correctamente.' };
            } else {
                return { error: 'Error al actualizar la imagen.' };
            }
        } catch (error) {
            console.error('Error al subir la imagen: ', error);
            throw error;
        }
    }

    // Método para obtener una imagen desde un registro y devolverla en formato base64
    async obtenerImagen(tabla, campoId, id) {
        try {
            // Determinar el nombre del campo de imagen según la tabla
            let campoImagen = 'imagen'; // Por defecto
            if (tabla === 'Servicios') {
                campoImagen = 'servImagen';
            } else if (tabla === 'Cursos') {
                campoImagen = 'cursoImagen';
            } else if (tabla === 'Hv') {
                campoImagen = 'hvImagenAntes'; // o 'hvImagenDespues' según se necesite
            }

            // Consultar el campo imagen del registro
            const [rows] = await db.query(`SELECT ?? FROM ?? WHERE ?? = ?`, [campoImagen, tabla, campoId, id]);

            // Validar si se encontró el registro
            if (rows.length === 0) {
                return { error: 'Registro no encontrado' };
            }

            // Verificar si el campo imagen está vacío
            if (!rows[0][campoImagen]) {
                return { error: 'No hay imagen asociada a este registro' };
            }

            // Convertir la imagen en binario a base64
            const imagenBase64 = rows[0][campoImagen].toString('base64');

            // Retornar la imagen codificada con el nombre del campo correspondiente
            const resultado = { imagen: imagenBase64 };
            resultado[campoImagen] = imagenBase64;

            return resultado;
        } catch (error) {
            console.error('Error al obtener la imagen ', error);
            throw error;
        }
    }

    // Método para eliminar una imagen (establece el campo imagen como NULL)
    async eliminarImagen(tabla, campoId, id) {
        try {
            // Verificar que el registrado exista
            const [registro] = await db.query(`SELECT * FROM ?? WHERE ?? = ?`, [tabla, campoId, id]);

            if (registro.length === 0) {
                return { error: 'No se encontró el registro con el ID proporcionado.' };
            }

            // Establecer el campo imagen como NULL
            const query = `UPDATE ?? SET imagen = NULL WHERE ?? = ?`;
            const [result] = await db.query(query, [tabla, campoId, id]);

            // Confirmar si se eliminó correctamente
            if (result.affectedRows > 0) {
                return { message: 'Imagen eliminada correctamente.' };
            } else {
                return { error: 'Error al eliminar la imagen.' };
            }
        } catch (error) {
            console.error('Error al eliminar la imagen: ', error);
            throw error;
        }
    }

    // Método que inserta una imagen si no existe o actualiza si ya hay una
    async insertarImagen(tabla, campoId, id, imagenBase64) {
        try {
            // Verificar que el registro exista
            const [registro] = await db.query(`SELECT * FROM ?? WHERE ?? = ?`, [tabla, campoId, id]);

            if (registro.length === 0) {
                return { error: 'No se encontró el registro con el ID proporcionado.' }
            }

            // Convertir la imagen a formato binario
            const bufferImagen = Buffer.from(imagenBase64, 'base64');

            // Consultar si ya hay una imagen existente
            const [imagenExistente] = await db.query(`SELECT imagen FROM ?? WHERE ?? = ?`, [tabla, campoId, id]);

            // Si ya hay una imagen, actualizar
            if (imagenExistente[0]?.imagen) {
                const query = `UPDATE ?? SET imagen = ? WHERE ?? = ?`;
                const [result] = await db.query(query, [tabla, bufferImagen, campoId, id]);

                if (result.affectedRows > 0) {
                    return { message: 'Imagen actualizada correctamente.' };
                } else {
                    return { error: 'Error al actualizar la imagen.' };
                }
            } else {
                // Si no hay imagen, insertar una nueva
                const query = `UPDATE ?? SET imagen = ? WHERE ?? = ?`;
                const [result] = await db.query(query, [tabla, bufferImagen, campoId, id]);

                if (result.affectedRows > 0) {
                    return { message: 'Imagen insertada correctamente.' };
                } else {
                    return { error: 'Error al insertar la imagen.' };
                }
            }
        } catch (error) {
            console.error('Error al insertar la imagen: ', error);
            throw error;
        }
    }

    // Método general que decide si subir una imagen o solo obtenerla
    async procesarImagen(tabla, campoId, id, imagenBase64 = null) {
        // Si se pasa una imagen, la sube
        if (imagenBase64) {
            return await this.subirImagen(tabla, campoId, id, imagenBase64);
        } else {
            // Si no, intenta recuperarla
            return await this.obtenerImagen(tabla, campoId, id);
        }
    }
}

// Exportar una instancia del controlador para su uso en rutas u otros módulos
module.exports = new ImagenesController();