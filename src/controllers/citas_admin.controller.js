// Controlador para obtener todas las citas del admin
const db = require('../config/conexion.db');

class CitasController {
    // Método para obtener citas con detalles (JOINs)
    async obtenerCitasConDetalles(includeCliente = false) {
        try {
            // Query base: Citas + JOIN con Cliente, Servicios, Profesional
            let selectFields = `
                c.idCita,
                cl.nombreCliente,
                s.servNombre,
                c.fechaCita,
                c.horaCita,
                p.nombreProfesional,
                c.estadoPago,
                c.estadoCita
            `;

            // CAMBIO: Si includeCliente=true, agrega fechaNacCliente y celularCliente al SELECT
            if (includeCliente) {
                selectFields += `, cl.fechaNacCliente, cl.celularCliente`;
            }

            const query = `
                SELECT ${selectFields}
                FROM Citas c
                JOIN Cliente cl ON c.idCliente = cl.idCliente
                JOIN Servicios s ON c.idServicios = s.idServicios
                JOIN Profesional p ON c.idProfesional = p.idProfesional
                ORDER BY c.fechaCita DESC, c.horaCita ASC
            `;

            const [resultado] = await db.query(query);

            // Opcional: Mapea para fallback null si no hay datos (ya plano por SQL)
            return resultado.map(row => ({
                ...row,
                fechaNacCliente: row.fechaNacCliente || null,
                celularCliente: row.celularCliente || null
            }));

        } catch (error) {
            console.error('Error al obtener las citas con detalles:', error);
            throw error;
        }
    }
}

module.exports = new CitasController();