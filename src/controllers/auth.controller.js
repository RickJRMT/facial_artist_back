/**
 * src/controllers/auth.controller.js
 * Controlador de autenticación - Solo un administrador (Natalia)
 */

const pool = require('../config/conexion.db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'natalia-facial-artist-2025-super-secreto';

class AuthController {
    static async login(req, res) {
        const { correo, password } = req.body;

        // LOGS PARA DEPURAR (puedes borrarlos después)
        console.log('Intento de login → correo:', correo);
        console.log('Password recibida:', password ? 'Sí' : 'No');

        if (!correo || !password) {
            return res.status(400).json({
                ok: false,
                message: 'Correo y contraseña son obligatorios',
            });
        }

        try {
            // Buscamos exactamente por correo (TRIM para evitar espacios)
            const [rows] = await pool.query(
                `SELECT idProfesional, nombreProfesional, correoProfesional, contraProfesional 
         FROM Profesional 
         WHERE TRIM(correoProfesional) = ? 
         LIMIT 1`,
                [correo.trim()]
            );

            if (rows.length === 0) {
                console.log('No se encontró el usuario');
                return res.status(401).json({
                    ok: false,
                    message: 'Credenciales incorrectas',
                });
            }

            const admin = rows[0];

            // Verificamos la contraseña
            const passwordValida = await bcrypt.compare(password, admin.contraProfesional);

            console.log('¿Contraseña válida?', passwordValida);

            if (!passwordValida) {
                return res.status(401).json({
                    ok: false,
                    message: 'Credenciales incorrectas',
                });
            }

            // GENERAMOS EL TOKEN
            const token = jwt.sign(
                {
                    id: admin.idProfesional,
                    nombre: admin.nombreProfesional,
                    correo: admin.correoProfesional,
                    role: 'admin',
                },
                JWT_SECRET,
                { expiresIn: '8h' }
            );

            return res.status(200).json({
                ok: true,
                message: 'Login exitoso',
                token,
                user: {
                    id: admin.idProfesional,
                    nombre: admin.nombreProfesional,
                    correo: admin.correoProfesional,
                },
            });
        } catch (error) {
            console.error('Error en AuthController.login:', error);
            return res.status(500).json({
                ok: false,
                message: 'Error interno del servidor',
            });
        }
    }
}

module.exports = AuthController;