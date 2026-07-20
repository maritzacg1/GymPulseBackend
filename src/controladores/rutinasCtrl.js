import { connmysql } from '../db.js';

export const getRutinas = async (req, res) => {
  try {
    const [rows] = await connmysql.query(`
      SELECT 
        r.id_rutina,
        r.id_entrenador,
        r.nombre,
        r.descripcion,
        r.objetivo,
        r.nivel,
        r.estado,
        CONCAT(u.nombres, ' ', u.apellidos) AS entrenador
      FROM rutinas r
      LEFT JOIN entrenadores e ON r.id_entrenador = e.id_entrenador
      LEFT JOIN usuarios u ON e.id_usuario = u.id_usuario
      WHERE r.estado = 1
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar rutinas', error: error.message });
  }
};

export const getRutinaDetalle = async (req, res) => {
  try {
    const { id } = req.params;

    const [rutina] = await connmysql.query(
      `SELECT * FROM rutinas WHERE id_rutina = ?`,
      [id]
    );

    if (rutina.length === 0) {
      return res.status(404).json({ message: 'Rutina no encontrada' });
    }

    const [ejercicios] = await connmysql.query(`
      SELECT 
        re.id_rutina_ejercicio,
        re.id_ejercicio,
        e.nombre AS ejercicio,
        e.grupo_muscular,
        re.series,
        re.repeticiones,
        re.tiempo_segundos,
        re.descanso_segundos,
        re.orden
      FROM rutina_ejercicios re
      INNER JOIN ejercicios e ON re.id_ejercicio = e.id_ejercicio
      WHERE re.id_rutina = ?
      ORDER BY re.orden ASC
    `, [id]);

    res.json({
      rutina: rutina[0],
      ejercicios
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener detalle de rutina', error: error.message });
  }
};

export const createRutina = async (req, res) => {
  try {
    const { id_entrenador, nombre, descripcion, objetivo, nivel } = req.body;

    const [result] = await connmysql.query(
      `INSERT INTO rutinas 
      (id_entrenador, nombre, descripcion, objetivo, nivel)
      VALUES (?, ?, ?, ?, ?)`,
      [id_entrenador, nombre, descripcion, objetivo, nivel]
    );

    res.status(201).json({
      message: 'Rutina registrada correctamente',
      id_rutina: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar rutina', error: error.message });
  }
};

export const updateRutina = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_entrenador, nombre, descripcion, objetivo, nivel, estado } = req.body;

    const [result] = await connmysql.query(
      `UPDATE rutinas SET
        id_entrenador = ?,
        nombre = ?,
        descripcion = ?,
        objetivo = ?,
        nivel = ?,
        estado = ?
      WHERE id_rutina = ?`,
      [id_entrenador, nombre, descripcion, objetivo, nivel, estado, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Rutina no encontrada' });
    }

    res.json({ message: 'Rutina actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar rutina', error: error.message });
  }
};
export const agregarEjercicioRutina = async (req, res) => {
  try {
    const { id_rutina, id_ejercicio, series, repeticiones, tiempo_segundos, descanso_segundos, orden } = req.body;

    const [result] = await connmysql.query(
      `INSERT INTO rutina_ejercicios
      (id_rutina, id_ejercicio, series, repeticiones, tiempo_segundos, descanso_segundos, orden)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id_rutina, id_ejercicio, series, repeticiones, tiempo_segundos, descanso_segundos, orden]
    );

    res.status(201).json({
      message: 'Ejercicio agregado a la rutina correctamente',
      id_rutina_ejercicio: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar ejercicio a rutina', error: error.message });
  }
};

export const eliminarEjercicioRutina = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await connmysql.query(
      `DELETE FROM rutina_ejercicios WHERE id_rutina_ejercicio = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Ejercicio de rutina no encontrado' });
    }

    res.json({ message: 'Ejercicio eliminado de la rutina correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar ejercicio de rutina', error: error.message });
  }
};
export const deleteRutina = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await connmysql.query(
      `UPDATE rutinas SET estado = 0 WHERE id_rutina = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Rutina no encontrada' });
    }

    res.json({ message: 'Rutina eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar rutina', error: error.message });
  }
  
};
export const getMisRutinas = async (req, res) => {

  try {

    const id_usuario = req.usuario.id_usuario;

    const [rows] = await connmysql.query(`
      SELECT
        r.*
      FROM usuario_rutina ur
      INNER JOIN rutinas r
        ON ur.id_rutina = r.id_rutina
      WHERE ur.id_usuario = ?
      AND ur.estado = 1
    `,[id_usuario]);

    res.json(rows);

  } catch(error){

    res.status(500).json({
      message:'Error al obtener rutinas',
      error:error.message
    });

  }

};
export const asignarRutina = async (req,res)=>{

  try{

    const {
      id_usuario,
      id_rutina
    } = req.body;

    await connmysql.query(`
      INSERT INTO usuario_rutina
      (
        id_usuario,
        id_rutina,
        fecha_asignacion,
        estado
      )
      VALUES
      (
        ?,
        ?,
        CURDATE(),
        1
      )
    `,[id_usuario,id_rutina]);

    res.json({
      message:'Rutina asignada'
    });

  }catch(error){

    res.status(500).json({
      error:error.message
    });

  }

};
export const getRutinasAsignadas = async (req,res)=>{

  try{

    const [rows] = await connmysql.query(`
      SELECT
        ur.id_usuario_rutina,
        u.id_usuario,
        CONCAT(
          u.nombres,
          ' ',
          u.apellidos
        ) cliente,
        r.id_rutina,
        r.nombre rutina,
        ur.fecha_asignacion
      FROM usuario_rutina ur
      INNER JOIN usuarios u
        ON ur.id_usuario=u.id_usuario
      INNER JOIN rutinas r
        ON ur.id_rutina=r.id_rutina
      WHERE ur.estado=1
      ORDER BY cliente
    `);

    res.json(rows);

  }catch(error){

    res.status(500).json({
      error:error.message
    });

  }

};
export const eliminarRutinaAsignada = async (req,res)=>{

  try{

    const { id } = req.params;

    await connmysql.query(`
      UPDATE usuario_rutina
      SET estado=0
      WHERE id_usuario_rutina=?
    `,[id]);

    res.json({
      message:'Rutina retirada'
    });

  }catch(error){

    res.status(500).json({
      error:error.message
    });

  }

};