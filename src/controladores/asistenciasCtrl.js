import { connmysql } from '../db.js';

export const getAsistencias = async (req, res) => {
  try {
    const [rows] = await connmysql.query(`
      SELECT 
        a.id_asistencia,
        a.fecha,
        a.hora_entrada,
        a.hora_salida,
        a.metodo_ingreso,
        u.id_usuario,
        u.nombres,
        u.apellidos,
        u.cedula,
        u.qr_codigo
      FROM asistencias a
      INNER JOIN usuarios u ON a.id_usuario = u.id_usuario
      ORDER BY a.fecha DESC, a.hora_entrada DESC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar asistencias', error: error.message });
  }
};

export const registrarAsistenciaQR = async (req, res) => {
  try {
    const { qr_codigo } = req.body;

    const [usuario] = await connmysql.query(
      'SELECT id_usuario, nombres, apellidos FROM usuarios WHERE qr_codigo = ? AND estado = 1',
      [qr_codigo]
    );

    if (usuario.length === 0) {
      return res.status(404).json({ message: 'QR no válido o usuario inactivo' });
    }

    const id_usuario = usuario[0].id_usuario;

    const [result] = await connmysql.query(
      `INSERT INTO asistencias 
      (id_usuario, fecha, hora_entrada, metodo_ingreso)
      VALUES (?, CURDATE(), CURTIME(), 'QR')`,
      [id_usuario]
    );

    res.status(201).json({
      message: 'Asistencia registrada correctamente',
      id_asistencia: result.insertId,
      usuario: usuario[0]
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar asistencia', error: error.message });
  }
};
export const getMisAsistencias = async (req,res)=>{

  try{

    const id_usuario = req.usuario.id_usuario;

    const [rows] = await connmysql.query(

      `SELECT *

      FROM asistencias

      WHERE id_usuario = ?

      ORDER BY fecha DESC,
      hora_entrada DESC`,

      [id_usuario]

    );

    res.json(rows);

  }catch(error){

    res.status(500).json({

      error:error.message

    });

  }
};