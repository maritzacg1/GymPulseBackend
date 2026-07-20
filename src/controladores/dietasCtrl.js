import { connmysql } from '../db.js';

export const getDietas = async (req, res) => {
  try {
    const [rows] = await connmysql.query(
      'SELECT * FROM dietas WHERE estado = 1'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar dietas', error: error.message });
  }
};

export const getDietaById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await connmysql.query(
      'SELECT * FROM dietas WHERE id_dieta = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Dieta no encontrada' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar dieta', error: error.message });
  }
};

export const createDieta = async (req, res) => {
  try {
    const { nombre, descripcion, calorias, objetivo } = req.body;

    const [result] = await connmysql.query(
      `INSERT INTO dietas (nombre, descripcion, calorias, objetivo)
       VALUES (?, ?, ?, ?)`,
      [nombre, descripcion, calorias, objetivo]
    );

    res.status(201).json({
      message: 'Dieta registrada correctamente',
      id_dieta: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar dieta', error: error.message });
  }
};

export const updateDieta = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, calorias, objetivo, estado } = req.body;

    const [result] = await connmysql.query(
      `UPDATE dietas SET
        nombre = ?,
        descripcion = ?,
        calorias = ?,
        objetivo = ?,
        estado = ?
      WHERE id_dieta = ?`,
      [nombre, descripcion, calorias, objetivo, estado, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Dieta no encontrada' });
    }

    res.json({ message: 'Dieta actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar dieta', error: error.message });
  }
};

export const deleteDieta = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await connmysql.query(
      'UPDATE dietas SET estado = 0 WHERE id_dieta = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Dieta no encontrada' });
    }

    res.json({ message: 'Dieta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar dieta', error: error.message });
  }
};

export const getDietasUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await connmysql.query(`
      SELECT 
        ud.id_usuario_dieta,
        u.id_usuario,
        CONCAT(u.nombres, ' ', u.apellidos) AS usuario,
        d.id_dieta,
        d.nombre AS dieta,
        d.descripcion,
        d.calorias,
        d.objetivo,
        ud.fecha_inicio,
        ud.fecha_fin
      FROM usuario_dieta ud
      INNER JOIN usuarios u ON ud.id_usuario = u.id_usuario
      INNER JOIN dietas d ON ud.id_dieta = d.id_dieta
      WHERE ud.id_usuario = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Este usuario no tiene dieta asignada' });
    }

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener dietas del usuario', error: error.message });
  }
};