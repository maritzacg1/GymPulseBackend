import { connmysql } from '../db.js';

export const getNotificacionesUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await connmysql.query(`
      SELECT 
        id_notificacion,
        id_usuario,
        titulo,
        mensaje,
        leida,
        fecha
      FROM notificaciones
      WHERE id_usuario = ?
      ORDER BY fecha DESC
    `, [id]);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener notificaciones', 
      error: error.message 
    });
  }
};

export const marcarNotificacionLeida = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await connmysql.query(
      `UPDATE notificaciones SET leida = 1 WHERE id_notificacion = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Notificación no encontrada' });
    }

    res.json({ message: 'Notificación marcada como leída' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al actualizar notificación', 
      error: error.message 
    });
  }
};