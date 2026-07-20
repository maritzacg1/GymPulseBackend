import { connmysql } from '../db.js';
import bcrypt from 'bcryptjs';
export const getUsuarios = async (req, res) => {
  try {
    const [rows] = await connmysql.query(`
      SELECT 
        u.id_usuario,
        r.nombre AS rol,
        u.nombres,
        u.apellidos,
        u.cedula,
        u.telefono,
        u.correo,
        u.fecha_nacimiento,
        u.genero,
        u.foto,
        u.qr_codigo,
        u.estado,
        u.fecha_registro
      FROM usuarios u
      INNER JOIN roles r ON u.id_rol = r.id_rol
      WHERE u.estado = 1
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar usuarios', error: error.message });
  }
};

export const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await connmysql.query(
      'SELECT * FROM usuarios WHERE id_usuario = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar usuario', error: error.message });
  }
};

export const getPerfil = async (req, res) => {

  try {

    const id_usuario = req.usuario.id_usuario;

    const [rows] = await connmysql.query(`
      SELECT
        u.id_usuario,
        r.nombre AS rol,
        u.nombres,
        u.apellidos,
        u.cedula,
        u.telefono,
        u.correo,
        u.fecha_nacimiento,
        u.genero,
        u.foto,
        u.qr_codigo,
        u.estado,
        u.fecha_registro
      FROM usuarios u
      INNER JOIN roles r
        ON u.id_rol = r.id_rol
      WHERE u.id_usuario = ?
    `,[id_usuario]);

    if(rows.length==0){

      return res.status(404).json({
        message:'Usuario no encontrado'
      });

    }

    res.json(rows[0]);

  } catch(error){

    res.status(500).json({
      message:'Error al obtener perfil',
      error:error.message
    });

  }

};

export const createUsuario = async (req, res) => {

  try {

    const {
      id_rol,
      nombres,
      apellidos,
      cedula,
      telefono,
      correo,
      password,
      fecha_nacimiento,
      genero,
      foto
    } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await connmysql.query(

      `INSERT INTO usuarios
      (
        id_rol,
        nombres,
        apellidos,
        cedula,
        telefono,
        correo,
        password,
        fecha_nacimiento,
        genero,
        foto
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,

      [
        id_rol,
        nombres,
        apellidos,
        cedula,
        telefono,
        correo,
        passwordHash,
        fecha_nacimiento,
        genero,
        foto
      ]

    );

    // id del usuario recién creado
    const idUsuario = result.insertId;

    // Generar código QR
    const qr = `GYMPULSE-${idUsuario}`;

    await connmysql.query(

      `UPDATE usuarios
       SET qr_codigo=?
       WHERE id_usuario=?`,

      [qr, idUsuario]

    );

    res.status(201).json({

      message:'Usuario registrado correctamente',

      id_usuario:idUsuario,

      qr_codigo:qr

    });

  } catch(error){

    res.status(500).json({

      message:'Error al registrar usuario',

      error:error.message

    });

  }

};
export const updateUsuario = async (req, res) => {

  try {

    const { id } = req.params;


    const {
      id_rol,
      nombres,
      apellidos,
      cedula,
      telefono,
      correo,
      fecha_nacimiento,
      genero,
      foto,
      qr_codigo,
      estado
    } = req.body;


    const [usuarioActual] = await connmysql.query(
      'SELECT * FROM usuarios WHERE id_usuario = ?',
      [id]
    );


    if(usuarioActual.length === 0){

      return res.status(404).json({
        message:'Usuario no encontrado'
      });

    }


    const usuario = usuarioActual[0];


    const nuevoQR = qr_codigo || usuario.qr_codigo;

    const nuevoEstado = estado ?? usuario.estado;


    await connmysql.query(

      `UPDATE usuarios SET

        id_rol = ?,
        nombres = ?,
        apellidos = ?,
        cedula = ?,
        telefono = ?,
        correo = ?,
        fecha_nacimiento = ?,
        genero = ?,
        foto = ?,
        qr_codigo = ?,
        estado = ?

      WHERE id_usuario = ?`,

      [

        id_rol,
        nombres,
        apellidos,
        cedula,
        telefono,
        correo,
        fecha_nacimiento,
        genero,
        foto || usuario.foto,
        nuevoQR,
        nuevoEstado,
        id

      ]

    );


    res.json({

      message:'Usuario actualizado correctamente',

      qr_codigo:nuevoQR

    });


  } catch(error){


    res.status(500).json({

      message:'Error al actualizar usuario',

      error:error.message

    });


  }

};
export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await connmysql.query(
      'UPDATE usuarios SET estado = 0 WHERE id_usuario = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }

};
export const actualizarFoto = async (req, res) => {

  try {

    const { id } = req.params;

    const { foto } = req.body;

    const [result] = await connmysql.query(

      `UPDATE usuarios
       SET foto = ?
       WHERE id_usuario = ?`,

      [foto, id]

    );

    if(result.affectedRows == 0){

      return res.status(404).json({
        message:'Usuario no encontrado'
      });

    }

    res.json({

      message:'Foto actualizada correctamente'

    });

  } catch(error){

    res.status(500).json({

      message:'Error al actualizar foto',

      error:error.message

    });

  }

};
