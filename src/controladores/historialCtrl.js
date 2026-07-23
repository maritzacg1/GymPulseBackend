import { connmysql } from '../db.js';

/* ==========================================
   OBTENER HISTORIAL
========================================== */

export const getHistorial = async (req, res) => {

  try {

    const [rows] = await connmysql.query(`

      SELECT

        h.id_historial,
        h.id_usuario,

        CONCAT(
          u.nombres,
          ' ',
          u.apellidos
        ) AS usuario,

        h.modulo,
        h.accion,
        h.descripcion,
        h.fecha

      FROM historial_actividad h

      LEFT JOIN usuarios u
      ON h.id_usuario = u.id_usuario

      ORDER BY h.fecha DESC

    `);

    res.json(rows);

  } catch (error) {

    res.status(500).json({

      message: 'Error al obtener historial',

      error: error.message

    });

  }

};


/* ==========================================
   REGISTRAR HISTORIAL DESDE API
========================================== */

export const registrarHistorialApi = async (req, res) => {

  try {

    const {

      id_usuario,
      modulo,
      accion,
      descripcion

    } = req.body;

    const [result] = await connmysql.query(

      `
      INSERT INTO historial_actividad
      (
        id_usuario,
        modulo,
        accion,
        descripcion
      )
      VALUES (?, ?, ?, ?)
      `,

      [

        id_usuario,
        modulo,
        accion,
        descripcion

      ]

    );

    res.status(201).json({

      message: 'Historial registrado correctamente',

      id_historial: result.insertId

    });

  } catch (error) {

    res.status(500).json({

      message: 'Error al registrar historial',

      error: error.message

    });

  }

};


/* ==========================================
   FUNCIÓN AUXILIAR
   PARA USAR DESDE OTROS CONTROLADORES
========================================== */

export const guardarHistorial = async (

  id_usuario,
  modulo,
  accion,
  descripcion

) => {

  try {

    await connmysql.query(

      `
      INSERT INTO historial_actividad
      (
        id_usuario,
        modulo,
        accion,
        descripcion
      )
      VALUES (?, ?, ?, ?)
      `,

      [

        id_usuario,
        modulo,
        accion,
        descripcion

      ]

    );

  } catch (error) {

    console.error(

      'Error guardando historial:',

      error.message

    );

  }

};