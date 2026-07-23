import { connmysql } from '../db.js';
import { guardarHistorial } from './historialCtrl.js';
export const getEjercicios = async (req, res) => {
  try {
    const [rows] = await connmysql.query(`
      SELECT 
        e.id_ejercicio,
        e.id_categoria,
        c.nombre AS categoria,
        e.nombre,
        e.descripcion,
        e.grupo_muscular,
        e.imagen,
        e.video,
        e.calorias_estimadas,
        e.estado
      FROM ejercicios e
      LEFT JOIN categorias_ejercicio c ON e.id_categoria = c.id_categoria
      WHERE e.estado = 1
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar ejercicios', error: error.message });
  }
};

export const getEjercicioById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await connmysql.query(
      'SELECT * FROM ejercicios WHERE id_ejercicio = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Ejercicio no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar ejercicio', error: error.message });
  }
};

export const createEjercicio = async (req, res) => {
  try {
    const {
      id_categoria,
      nombre,
      descripcion,
      grupo_muscular,
      imagen,
      video,
      calorias_estimadas
    } = req.body;

    const [result] = await connmysql.query(
      `INSERT INTO ejercicios 
      (id_categoria, nombre, descripcion, grupo_muscular, imagen, video, calorias_estimadas)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id_categoria, nombre, descripcion, grupo_muscular, imagen, video, calorias_estimadas]
    );
    await guardarHistorial(

  req.usuario.id_usuario,

  'Ejercicios',

  'Crear',

  `Se registró el ejercicio "${nombre}"`

);

    res.status(201).json({
      message: 'Ejercicio registrado correctamente',
      id_ejercicio: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar ejercicio', error: error.message });
  }
};

export const updateEjercicio = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      id_categoria,
      nombre,
      descripcion,
      grupo_muscular,
      imagen,
      video,
      calorias_estimadas,
      estado
    } = req.body;

    const [result] = await connmysql.query(
      `UPDATE ejercicios SET
        id_categoria = ?,
        nombre = ?,
        descripcion = ?,
        grupo_muscular = ?,
        imagen = ?,
        video = ?,
        calorias_estimadas = ?,
        estado = ?
      WHERE id_ejercicio = ?`,
      [id_categoria, nombre, descripcion, grupo_muscular, imagen, video, calorias_estimadas, estado, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Ejercicio no encontrado' });
    }
await guardarHistorial(

  req.usuario.id_usuario,

  'Ejercicios',

  'Actualizar',

  `Se actualizó el ejercicio "${nombre}"`

);
    res.json({ message: 'Ejercicio actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar ejercicio', error: error.message });
  }
};

export const deleteEjercicio = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await connmysql.query(
      'UPDATE ejercicios SET estado = 0 WHERE id_ejercicio = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Ejercicio no encontrado' });
    }
await guardarHistorial(

  req.usuario.id_usuario,

  'Ejercicios',

  'Eliminar',

  `Se eliminó el ejercicio con ID ${id}`

);
    res.json({ message: 'Ejercicio eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar ejercicio', error: error.message });
  }
};