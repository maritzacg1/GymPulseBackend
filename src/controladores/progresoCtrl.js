import { connmysql } from '../db.js';
export const getProgresoUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await connmysql.query(`
      SELECT 
        p.id_progreso,
        u.id_usuario,
        CONCAT(u.nombres, ' ', u.apellidos) AS usuario,
        p.peso,
        p.altura,
        p.imc,
        p.grasa_corporal,
        p.masa_muscular,
        p.fecha_registro
      FROM progreso_fisico p
      INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
      WHERE p.id_usuario = ?
      ORDER BY p.fecha_registro DESC
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No hay progreso registrado para este usuario' });
    }

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener progreso físico', error: error.message });
  }
};