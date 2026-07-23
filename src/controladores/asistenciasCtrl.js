import { connmysql } from '../db.js';
import { guardarHistorial } from './historialCtrl.js';
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
      INNER JOIN usuarios u
        ON a.id_usuario = u.id_usuario
      ORDER BY a.fecha DESC,
               a.hora_entrada DESC
    `);

    res.json(rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({

      message: 'Error al listar asistencias',

      error: error.message

    });

  }

};

export const registrarAsistenciaQR = async (req, res) => {

  try {

    const { qr_codigo } = req.body;

    console.log("==================================");
    console.log("QR recibido:", qr_codigo);

    if (!qr_codigo) {

      return res.status(400).json({

        message: 'Debe enviar el código QR'

      });

    }

    const codigo = qr_codigo.trim();

    const [usuario] = await connmysql.query(

      `SELECT
          id_usuario,
          nombres,
          apellidos,
          qr_codigo
       FROM usuarios
       WHERE TRIM(qr_codigo)=?
       AND estado=1`,

      [codigo]

    );

    console.log("Usuario encontrado:", usuario);

    if (usuario.length === 0) {

      return res.status(404).json({

        message: 'QR no válido o usuario inactivo'

      });

    }

    const id_usuario = usuario[0].id_usuario;

    const [asistenciaHoy] = await connmysql.query(

      `SELECT id_asistencia
       FROM asistencias
       WHERE id_usuario=?
       AND fecha=CURDATE()`,

      [id_usuario]

    );

    if (asistenciaHoy.length > 0) {

      return res.json({

        message: 'La asistencia ya fue registrada hoy.',

        usuario: usuario[0]

      });

    }

    const [result] = await connmysql.query(

      `INSERT INTO asistencias
      (
        id_usuario,
        fecha,
        hora_entrada,
        metodo_ingreso
      )
      VALUES
      (
        ?,
        CURDATE(),
        CURTIME(),
        'QR'
      )`,

      [id_usuario]

    );
    await guardarHistorial(

  id_usuario,

  'Asistencias',

  'Ingreso QR',

  `${usuario[0].nombres} ${usuario[0].apellidos} ingresó al gimnasio mediante código QR`

  );
    console.log("Asistencia registrada:", result.insertId);

    res.status(201).json({

      message: 'Asistencia registrada correctamente',

      id_asistencia: result.insertId,

      usuario: usuario[0]

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      message: 'Error al registrar asistencia',

      error: error.message

    });

  }

};

export const getMisAsistencias = async (req, res) => {

  try {

    const id_usuario = req.usuario.id_usuario;

    const [rows] = await connmysql.query(

      `SELECT
          id_asistencia,
          fecha,
          hora_entrada,
          hora_salida,
          metodo_ingreso
       FROM asistencias
       WHERE id_usuario=?
       ORDER BY fecha DESC,
                hora_entrada DESC`,

      [id_usuario]

    );

    res.json(rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({

      message: 'Error al obtener asistencias',

      error: error.message

    });

  }

};