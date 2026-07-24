import { connmysql } from '../db.js';

import {
  guardarHistorial
} from './historialCtrl.js';


/* ==========================================
   LISTAR PROGRESO DE TODOS LOS CLIENTES
   ADMINISTRADOR Y ENTRENADOR
========================================== */

export const getProgresos = async (
  req,
  res
) => {

  try {

    const [rows] =
      await connmysql.query(`

        SELECT

          pf.id_progreso,
          pf.id_usuario,

          CONCAT(
            u.nombres,
            ' ',
            u.apellidos
          ) AS usuario,

          u.nombres,
          u.apellidos,
          u.correo,
          u.foto,

          pf.peso,
          pf.altura,
          pf.imc,
          pf.grasa_corporal,
          pf.masa_muscular,
          pf.fecha_registro

        FROM progreso_fisico pf

        INNER JOIN usuarios u

          ON u.id_usuario =
             pf.id_usuario

        ORDER BY

          pf.fecha_registro DESC,
          pf.id_progreso DESC

      `);

    return res.json(rows);

  } catch (error) {

    console.error(
      'Error al listar progresos:',
      error
    );

    return res.status(500).json({

      message:
        'Error al listar el progreso físico',

      error:
        error.message

    });

  }

};


/* ==========================================
   PROGRESO DE UN CLIENTE
========================================== */

export const getProgresoUsuario = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;

    const [rows] =
      await connmysql.query(`

        SELECT

          pf.id_progreso,
          pf.id_usuario,

          CONCAT(
            u.nombres,
            ' ',
            u.apellidos
          ) AS usuario,

          u.nombres,
          u.apellidos,
          u.correo,
          u.foto,

          pf.peso,
          pf.altura,
          pf.imc,
          pf.grasa_corporal,
          pf.masa_muscular,
          pf.fecha_registro

        FROM progreso_fisico pf

        INNER JOIN usuarios u

          ON u.id_usuario =
             pf.id_usuario

        WHERE pf.id_usuario = ?

        ORDER BY

          pf.fecha_registro DESC,
          pf.id_progreso DESC

      `, [id]);

    return res.json(rows);

  } catch (error) {

    console.error(
      'Error al obtener progreso:',
      error
    );

    return res.status(500).json({

      message:
        'Error al obtener el progreso físico del cliente',

      error:
        error.message

    });

  }

};


/* ==========================================
   OBTENER UNA MEDICIÓN
========================================== */

export const getProgresoById = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;

    const [rows] =
      await connmysql.query(`

        SELECT

          id_progreso,
          id_usuario,
          peso,
          altura,
          imc,
          grasa_corporal,
          masa_muscular,
          fecha_registro

        FROM progreso_fisico

        WHERE id_progreso = ?

      `, [id]);

    if (rows.length === 0) {

      return res.status(404).json({

        message:
          'Registro de progreso no encontrado'

      });

    }

    return res.json(
      rows[0]
    );

  } catch (error) {

    console.error(
      'Error al buscar progreso:',
      error
    );

    return res.status(500).json({

      message:
        'Error al buscar el progreso físico',

      error:
        error.message

    });

  }

};


/* ==========================================
   REGISTRAR PROGRESO
========================================== */

export const createProgreso = async (
  req,
  res
) => {

  try {

    const {

      id_usuario,
      peso,
      altura,
      grasa_corporal,
      masa_muscular,
      fecha_registro

    } = req.body;

    if (!id_usuario) {

      return res.status(400).json({

        message:
          'Debe seleccionar un cliente'

      });

    }

    if (
      peso === undefined ||
      peso === null ||
      Number(peso) <= 0
    ) {

      return res.status(400).json({

        message:
          'El peso debe ser mayor a cero'

      });

    }

    if (
      altura === undefined ||
      altura === null ||
      Number(altura) <= 0
    ) {

      return res.status(400).json({

        message:
          'La altura debe ser mayor a cero'

      });

    }

    const pesoNumero =
      Number(peso);

    const alturaNumero =
      Number(altura);

    const imc =
      Number(
        (
          pesoNumero /
          (
            alturaNumero *
            alturaNumero
          )
        ).toFixed(2)
      );

    const [usuarios] =
      await connmysql.query(`

        SELECT

          id_usuario,
          nombres,
          apellidos

        FROM usuarios

        WHERE id_usuario = ?

      `, [id_usuario]);

    if (usuarios.length === 0) {

      return res.status(404).json({

        message:
          'El cliente seleccionado no existe'

      });

    }

    const [result] =
      await connmysql.query(`

        INSERT INTO progreso_fisico
        (

          id_usuario,
          peso,
          altura,
          imc,
          grasa_corporal,
          masa_muscular,
          fecha_registro

        )

        VALUES (?, ?, ?, ?, ?, ?, ?)

      `, [

        Number(id_usuario),

        pesoNumero,

        alturaNumero,

        imc,

        grasa_corporal !== undefined &&
        grasa_corporal !== null &&
        grasa_corporal !== ''

          ? Number(grasa_corporal)

          : null,

        masa_muscular !== undefined &&
        masa_muscular !== null &&
        masa_muscular !== ''

          ? Number(masa_muscular)

          : null,

        fecha_registro ||
        new Date()
          .toISOString()
          .slice(0, 10)

      ]);

    const nombreCliente =
      `${usuarios[0].nombres} ${usuarios[0].apellidos}`;

    await guardarHistorial(

      req.usuario.id_usuario,

      'PROGRESO FÍSICO',

      'CREAR',

      `Registró el progreso físico de "${nombreCliente}"`

    );

    return res.status(201).json({

      message:
        'Progreso físico registrado correctamente',

      id_progreso:
        result.insertId,

      imc

    });

  } catch (error) {

    console.error(
      'Error al registrar progreso:',
      error
    );

    return res.status(500).json({

      message:
        'Error al registrar el progreso físico',

      error:
        error.message

    });

  }

};


/* ==========================================
   ACTUALIZAR PROGRESO
========================================== */

export const updateProgreso = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;

    const {

      id_usuario,
      peso,
      altura,
      grasa_corporal,
      masa_muscular,
      fecha_registro

    } = req.body;

    if (
      Number(peso) <= 0 ||
      Number(altura) <= 0
    ) {

      return res.status(400).json({

        message:
          'El peso y la altura deben ser mayores a cero'

      });

    }

    const pesoNumero =
      Number(peso);

    const alturaNumero =
      Number(altura);

    const imc =
      Number(
        (
          pesoNumero /
          (
            alturaNumero *
            alturaNumero
          )
        ).toFixed(2)
      );

    const [result] =
      await connmysql.query(`

        UPDATE progreso_fisico

        SET

          id_usuario = ?,
          peso = ?,
          altura = ?,
          imc = ?,
          grasa_corporal = ?,
          masa_muscular = ?,
          fecha_registro = ?

        WHERE id_progreso = ?

      `, [

        Number(id_usuario),

        pesoNumero,

        alturaNumero,

        imc,

        grasa_corporal !== undefined &&
        grasa_corporal !== null &&
        grasa_corporal !== ''

          ? Number(grasa_corporal)

          : null,

        masa_muscular !== undefined &&
        masa_muscular !== null &&
        masa_muscular !== ''

          ? Number(masa_muscular)

          : null,

        fecha_registro,

        id

      ]);

    if (
      result.affectedRows === 0
    ) {

      return res.status(404).json({

        message:
          'Registro de progreso no encontrado'

      });

    }

    await guardarHistorial(

      req.usuario.id_usuario,

      'PROGRESO FÍSICO',

      'ACTUALIZAR',

      `Actualizó el registro de progreso ID ${id}`

    );

    return res.json({

      message:
        'Progreso físico actualizado correctamente',

      imc

    });

  } catch (error) {

    console.error(
      'Error al actualizar progreso:',
      error
    );

    return res.status(500).json({

      message:
        'Error al actualizar el progreso físico',

      error:
        error.message

    });

  }

};


/* ==========================================
   ELIMINAR PROGRESO
========================================== */

export const deleteProgreso = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;

    const [result] =
      await connmysql.query(`

        DELETE FROM progreso_fisico

        WHERE id_progreso = ?

      `, [id]);

    if (
      result.affectedRows === 0
    ) {

      return res.status(404).json({

        message:
          'Registro de progreso no encontrado'

      });

    }

    await guardarHistorial(

      req.usuario.id_usuario,

      'PROGRESO FÍSICO',

      'ELIMINAR',

      `Eliminó el registro de progreso ID ${id}`

    );

    return res.json({

      message:
        'Registro de progreso eliminado correctamente'

    });

  } catch (error) {

    console.error(
      'Error al eliminar progreso:',
      error
    );

    return res.status(500).json({

      message:
        'Error al eliminar el progreso físico',

      error:
        error.message

    });

  }

};


/* ==========================================
   MI PROGRESO - CLIENTE AUTENTICADO
========================================== */

export const getMiProgreso = async (
  req,
  res
) => {

  try {

    const id_usuario =
      req.usuario.id_usuario;

    const [rows] =
      await connmysql.query(`

        SELECT

          id_progreso,
          id_usuario,
          peso,
          altura,
          imc,
          grasa_corporal,
          masa_muscular,
          fecha_registro

        FROM progreso_fisico

        WHERE id_usuario = ?

        ORDER BY

          fecha_registro DESC,
          id_progreso DESC

      `, [id_usuario]);

    return res.json(rows);

  } catch (error) {

    console.error(
      'Error al obtener mi progreso:',
      error
    );

    return res.status(500).json({

      message:
        'Error al obtener el progreso físico',

      error:
        error.message

    });

  }

};