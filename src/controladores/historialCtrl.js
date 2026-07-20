import { connmysql } from '../db.js';

export const getHistorial = async (req, res) => {
  try {
    const [rows] = await connmysql.query(`
      SELECT 
        h.id_historial,
        h.id_usuario,
        CONCAT(u.nombres, ' ', u.apellidos) AS usuario,
        h.accion,
        h.fecha
      FROM historial_actividad h
      INNER JOIN usuarios u ON h.id_usuario = u.id_usuario
      ORDER BY h.fecha DESC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener historial',
      error: error.message
    });
  }
};

export const registrarHistorial = async (req, res) => {
  try {
    const { id_usuario, accion } = req.body;

    const [result] = await connmysql.query(
      `INSERT INTO historial_actividad (id_usuario, accion)
       VALUES (?, ?)`,
      [id_usuario, accion]
    );

    res.status(201).json({
      message: 'Historial registrado correctamente',
      id_historial: result.insertId
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al registrar historial',
      error: error.message
    });
  }
};