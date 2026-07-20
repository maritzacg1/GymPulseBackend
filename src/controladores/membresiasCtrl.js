import { connmysql } from '../db.js';

export const getMembresias = async (req, res) => {
  try {
    const [rows] = await connmysql.query('SELECT * FROM membresias WHERE estado = 1');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar membresías', error: error.message });
  }
};

export const getMembresiaById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await connmysql.query('SELECT * FROM membresias WHERE id_membresia = ?', [id]);

    if (rows.length === 0) return res.status(404).json({ message: 'Membresía no encontrada' });

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar membresía', error: error.message });
  }
};

export const createMembresia = async (req, res) => {
  try {
    const { nombre, descripcion, precio, duracion_dias } = req.body;

    const [result] = await connmysql.query(
      `INSERT INTO membresias (nombre, descripcion, precio, duracion_dias)
       VALUES (?, ?, ?, ?)`,
      [nombre, descripcion, precio, duracion_dias]
    );

    res.status(201).json({
      message: 'Membresía registrada correctamente',
      id_membresia: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar membresía', error: error.message });
  }
};

export const updateMembresia = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, duracion_dias, estado } = req.body;

    const [result] = await connmysql.query(
      `UPDATE membresias SET
        nombre = ?,
        descripcion = ?,
        precio = ?,
        duracion_dias = ?,
        estado = ?
      WHERE id_membresia = ?`,
      [nombre, descripcion, precio, duracion_dias, estado, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: 'Membresía no encontrada' });

    res.json({ message: 'Membresía actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar membresía', error: error.message });
  }
};

export const deleteMembresia = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await connmysql.query(
      'UPDATE membresias SET estado = 0 WHERE id_membresia = ?',
      [id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: 'Membresía no encontrada' });

    res.json({ message: 'Membresía eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar membresía', error: error.message });
  }
};
export const asignarMembresiaUsuario = async (req, res) => {
  try {
    const { id_usuario, id_membresia, fecha_inicio, fecha_fin } = req.body;

    const [result] = await connmysql.query(
      `INSERT INTO usuario_membresia
      (id_usuario, id_membresia, fecha_inicio, fecha_fin, estado)
      VALUES (?, ?, ?, ?, 'Activa')`,
      [id_usuario, id_membresia, fecha_inicio, fecha_fin]
    );

    res.status(201).json({
      message: 'Membresía asignada correctamente',
      id_usuario_membresia: result.insertId
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al asignar membresía',
      error: error.message
    });
  }
};

export const getMembresiasUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await connmysql.query(`
      SELECT 
        um.id_usuario_membresia,
        u.id_usuario,
        CONCAT(u.nombres, ' ', u.apellidos) AS usuario,
        m.id_membresia,
        m.nombre AS membresia,
        m.precio,
        um.fecha_inicio,
        um.fecha_fin,
        um.estado
      FROM usuario_membresia um
      INNER JOIN usuarios u ON um.id_usuario = u.id_usuario
      INNER JOIN membresias m ON um.id_membresia = m.id_membresia
      WHERE um.id_usuario = ?
      ORDER BY um.fecha_inicio DESC
    `, [id]);

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener membresías del usuario',
      error: error.message
    });
  }
};
export const getMiMembresia = async (req,res)=>{

  try{

    const id_usuario=req.usuario.id_usuario;

    const [rows]=await connmysql.query(`
      SELECT
        um.id_usuario_membresia,
        um.fecha_inicio,
        um.fecha_fin,
        um.estado,
        m.nombre,
        m.descripcion,
        m.precio,
        m.duracion_dias
      FROM usuario_membresia um
      INNER JOIN membresias m
        ON um.id_membresia=m.id_membresia
      WHERE um.id_usuario=?
      ORDER BY um.fecha_fin DESC
      LIMIT 1
    `,[id_usuario]);

    if(rows.length==0){

      return res.json(null);

    }

    res.json(rows[0]);

  }catch(error){

    res.status(500).json({
      message:'Error al obtener la membresía',
      error:error.message
    });

  }

};