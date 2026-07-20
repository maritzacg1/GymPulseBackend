import { connmysql } from '../db.js';

export const getEntrenadores = async (req, res) => {
  try {
    const [rows] = await connmysql.query(`
      SELECT 
        e.id_entrenador,
        e.id_usuario,
        u.nombres,
        u.apellidos,
        u.cedula,
        u.telefono,
        u.correo,
        e.especialidad,
        e.experiencia
      FROM entrenadores e
      INNER JOIN usuarios u ON e.id_usuario = u.id_usuario
      WHERE u.estado = 1
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar entrenadores', error: error.message });
  }
};

export const getEntrenadorById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await connmysql.query(
      `SELECT * FROM entrenadores WHERE id_entrenador = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Entrenador no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar entrenador', error: error.message });
  }
};