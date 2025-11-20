-- Crear base de datos
CREATE DATABASE IF NOT EXISTS nataliaFacialArtist;
USE nataliaFacialArtist;

-- Tabla Cliente
CREATE TABLE IF NOT EXISTS Cliente (
    idCliente INT AUTO_INCREMENT PRIMARY KEY,
    nombreCliente VARCHAR(100) NOT NULL,
    celularCliente VARCHAR(20) UNIQUE NOT NULL,
    fechaNacCliente DATE,
    fechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla Profesional
CREATE TABLE IF NOT EXISTS Profesional (
    idProfesional INT AUTO_INCREMENT PRIMARY KEY,
    nombreProfesional VARCHAR(100) NOT NULL,
    correoProfesional VARCHAR(100) NOT NULL,
    telefonoProfesional VARCHAR(20) NOT NULL,
    contraProfesional VARCHAR(300),
    fechaCreacionProf DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla Servicios (con duración)
CREATE TABLE IF NOT EXISTS Servicios (
    idServicios INT AUTO_INCREMENT PRIMARY KEY,
    servNombre VARCHAR(100) NOT NULL,
    servDescripcion TEXT,
    servFechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    servCosto DECIMAL(10,2),
    servEstado ENUM('activo', 'inactivo') DEFAULT 'activo',
    servImagen LONGBLOB,
    servDuracion INT NOT NULL DEFAULT 60 -- duración en minutos
);

-- Tabla Cursos
CREATE TABLE IF NOT EXISTS Cursos (
    idCurso INT AUTO_INCREMENT PRIMARY KEY,
    nombreCurso VARCHAR(100) NOT NULL,
    cursoDescripcion TEXT,
    cursoDuracion VARCHAR(50),
    cursoCosto DECIMAL(10,2),
    cursoEstado ENUM('activo', 'inactivo') DEFAULT 'activo',
    cursoImagen LONGBLOB,
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla Citas
CREATE TABLE IF NOT EXISTS Citas (
    idCita INT AUTO_INCREMENT PRIMARY KEY,
    idCliente INT NOT NULL,
    idServicios INT NOT NULL,
    idProfesional INT NOT NULL,
    fechaCita DATE NOT NULL,
    horaCita TIME NOT NULL,
    fin_cita TIME,
    numeroReferencia VARCHAR (15) NULL UNIQUE, 
    estadoPago ENUM('pendiente','pagado') DEFAULT 'pendiente',
    estadoCita ENUM('confirmada', 'pendiente', 'cancelada', 'iniciada', 'finalizada') DEFAULT 'pendiente',
    FOREIGN KEY (idCliente) REFERENCES Cliente(idCliente),
    FOREIGN KEY (idServicios) REFERENCES Servicios(idServicios),
    FOREIGN KEY (idProfesional) REFERENCES Profesional(idProfesional)
);

-- Tabla Hv (modificada con ON DELETE CASCADE para eliminar automáticamente la HV al borrar la cita)
CREATE TABLE IF NOT EXISTS Hv (
    idHv INT AUTO_INCREMENT PRIMARY KEY,
    idCita INT NOT NULL UNIQUE,
    hvDesc TEXT,
    hvFechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    hvImagenAntes LONGBLOB DEFAULT Null,
    hvImagenDespues LONGBLOB DEFAULT Null,
    FOREIGN KEY (idCita) REFERENCES Citas(idCita) ON DELETE CASCADE
);

-- Tabla Horarios
CREATE TABLE IF NOT EXISTS Horarios (
    idHorario INT AUTO_INCREMENT PRIMARY KEY,
    idProfesional INT NOT NULL,         -- Relaciona el horario con un profesional
    fecha DATE NOT NULL,                -- Fecha específica
    hora_inicio TIME NOT NULL,          -- Hora de inicio de disponibilidad
    hora_fin TIME NOT NULL,             -- Hora de fin de disponibilidad
    estado ENUM('activo', 'inactivo') NOT NULL, -- Estado del horario: 'activo' o 'bloqueado'
    FOREIGN KEY (idProfesional) REFERENCES Profesional(idProfesional) ON DELETE CASCADE
);

-- Insertar datos en la tabla Cliente
INSERT INTO Cliente (nombreCliente, celularCliente, fechaNacCliente) 
VALUES 
('Carlos Pérez', '1234567890', '1985-08-15'),
('Ana Gómez', '0987654321', '1990-05-20'),
('Luis Martínez', '1122334455', '1992-11-10'),
('María Rodríguez', '3001234567', '1987-02-22'),
('Juan Gómez', '4002345678', '1995-07-12');

-- Insertar datos en la tabla Profesional
INSERT INTO Profesional (nombreProfesional, correoProfesional, telefonoProfesional, contraProfesional)
VALUES 
('Natalia Ruiz', 'natalia@facialartist.com', '3001234567', '$2a$12$JkJSWyBm7tCmXgpotpAOf.F.v8Dr07raqmKDaeoVU8kmE1LIgiPyO'), -- contraseña encriptada "admin123"
('Paola Fernández', 'paola@facialartist.com', '3007654321', null),
('Carla Díaz', 'carla@facialartist.com', '3009876543', null);

-- Insertar datos en la tabla Servicios
INSERT INTO Servicios (servNombre, servDescripcion, servCosto, servDuracion)
VALUES 
('Facial Revitalizante', 'Tratamiento facial que hidrata y rejuvenece la piel.', 120000.00, 60),
('Limpieza Facial', 'Limpieza profunda para eliminar impurezas de la piel.', 80000.00, 45),
('Mascarilla Reafirmante', 'Mascarilla para reafirmar la piel del rostro.', 15000.00, 30),
('Depilación Facial', 'Eliminación de vello facial con cera caliente.', 40000.00, 20),
('Mascarilla Antiedad', 'Mascarilla para reducir arrugas y mejorar la elasticidad de la piel.', 150.00, 50);

-- Insertar datos en la tabla Cursos
INSERT INTO Cursos (nombreCurso, cursoDescripcion, cursoCosto, cursoDuracion)
VALUES 
('Curso de Técnicas Faciales', 'Aprende las mejores técnicas para tratamientos faciales.', 200.00, '2 días'),
('Curso de Maquillaje Profesional', 'Formación integral en maquillaje profesional para eventos y fotos.', 150.00, '3 días'),
('Curso de Depilación Facial', 'Curso especializado en técnicas de depilación facial.', 100.00, '1 día');

-- Insertar datos en la tabla Citas
INSERT INTO Citas (idCliente, idServicios, idProfesional, fechaCita, horaCita, estadoPago, estadoCita)
VALUES 
(1, 2, 1, '2025-11-17', '10:00:00', 'pendiente', 'pendiente'),
(2, 1, 1, '2025-11-18', '11:00:00', 'pagado', 'confirmada'),
(3, 3, 2, '2025-11-19', '09:00:00', 'pendiente', 'cancelada'),
(4, 4, 2, '2025-11-20', '14:00:00', 'pagado', 'confirmada'),
(5, 5, 3, '2025-11-21', '16:00:00', 'pendiente', 'pendiente');

-- Insertar datos en la tabla Hv (informes de citas)
INSERT INTO Hv (idCita, hvDesc)
VALUES 
(1, 'Informe de la cita de limpieza facial, recomendación de productos'),
(2, 'Informe de cita con tratamiento facial revitalizante, piel hidratada y rejuvenecida'),
(3, 'Informe de cita de mascarilla reafirmante, piel suave y tensa'),
(4, 'Informe de cita de depilación facial, eliminación de vello facial realizado exitosamente'),
(5, 'Informe de cita de mascarilla antiedad, mejora de la elasticidad y luminosidad de la piel');

-- Insertar datos en la tabla Horarios
INSERT INTO Horarios (idProfesional, fecha, hora_inicio, hora_fin, estado)
VALUES 
(1, '2025-11-17', '09:00:00', '12:00:00', 'activo'),
(1, '2025-11-18', '09:00:00', '12:00:00', 'activo'),
(2, '2025-11-19', '14:00:00', '18:00:00', 'activo'),
(2, '2025-11-20', '14:00:00', '18:00:00', 'activo'),
(3, '2025-11-21', '08:00:00', '12:00:00', 'activo'),
(3, '2025-11-22', '08:00:00', '12:00:00', 'inactivo');

-- Verificar que se creó correctamente
SELECT * FROM Servicios;
SELECT * FROM Citas;
SELECT * FROM Cliente;
SELECT * FROM Horarios;
SELECT * FROM Profesional;
SELECT * FROM Hv;

SELECT 
    idProfesional,         -- Devuelve el ID único del profesional (clave primaria, normalmente 1)
    nombreProfesional,     -- Devuelve el nombre completo (ej: "Natalia Ruiz")
    correoProfesional,     -- Devuelve el correo electrónico (ej: "natalia@facialartist.com")
    contraProfesional      -- Devuelve el hash bcrypt de la contraseña (el campo que hemos estado actualizando)
FROM Profesional          -- Indica que la consulta se realiza sobre la tabla Profesional

WHERE correoProfesional LIKE '%natalia%';
-- Filtra los registros cuyo correo contenga la palabra "natalia" en cualquier posición.
-- El % es un comodín: 
--   - '%natalia%' = busca "natalia" en cualquier parte del correo
--   - Ejemplos que coincidirían: natalia@facialartist.com, Natalia@facial.com, contacto.natalia@dominio.com
-- Esto es útil para encontrar rápidamente el registro del administrador aunque no recuerdes el correo exacto o si tiene mayúsculas/minúsculas.

SET SQL_SAFE_UPDATES = 0;  
-- Desactiva temporalmente el "modo seguro" de MySQL. 
-- Esto permite hacer UPDATE sin que obligatoriamente la condición WHERE use una columna clave (PRIMARY KEY o índice único).
-- Se hace solo porque tu WHERE usa "idProfesional = 1" (que SÍ es clave primaria), pero a veces MySQL se queja igual en algunos entornos.

UPDATE Profesional
SET contraProfesional = '$2a$12$JkJSWyBm7tCmXgpotpAOf.F.v8Dr07raqmKDaeoVU8kmE1LIgiPyO'
WHERE idProfesional = 1;
-- Actualiza la contraseña del administrador (idProfesional = 1).
-- El valor '$2a$12$JkJSWyBm7tCmXgpotpAOf.F.v8Dr07raqmKDaeoVU8kmE1LIgiPyO' 
-- es un hash generado con bcrypt (12 rondas de costo) correspondiente exactamente a la contraseña plana "admin123".
-- A partir de ahora, cuando el usuario ingrese "admin123", bcrypt.compare devolverá true y el login funcionará.

SET SQL_SAFE_UPDATES = 1;  
-- Reactiva el modo seguro inmediatamente después de la operación.
-- Es buena práctica para evitar accidentes en futuras consultas.