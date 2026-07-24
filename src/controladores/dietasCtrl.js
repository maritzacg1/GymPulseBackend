import { connmysql } from '../db.js';

import {
  guardarHistorial
} from './historialCtrl.js';


/* ==========================================
   LISTAR DIETAS
========================================== */

export const getDietas = async (
  req,
  res
) => {

  try {

    const [rows] =
      await connmysql.query(`

        SELECT

          id_dieta,
          nombre,
          descripcion,
          calorias,
          objetivo,
          imagen,
          alimentos,
          comidas,
          estado

        FROM dietas

        WHERE estado = 1

        ORDER BY nombre ASC

      `);

    return res.json(rows);

  } catch (error) {

    console.error(
      'Error al listar dietas:',
      error
    );

    return res.status(500).json({

      message:
        'Error al listar dietas',

      error:
        error.message

    });

  }

};


/* ==========================================
   BUSCAR DIETA
========================================== */

export const getDietaById = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;

    const [rows] =
      await connmysql.query(`

        SELECT

          id_dieta,
          nombre,
          descripcion,
          calorias,
          objetivo,
          imagen,
          alimentos,
          comidas,
          estado

        FROM dietas

        WHERE id_dieta = ?

      `, [id]);

    if (rows.length === 0) {

      return res.status(404).json({

        message:
          'Dieta no encontrada'

      });

    }

    return res.json(
      rows[0]
    );

  } catch (error) {

    console.error(
      'Error al buscar dieta:',
      error
    );

    return res.status(500).json({

      message:
        'Error al buscar dieta',

      error:
        error.message

    });

  }

};


/* ==========================================
   CREAR DIETA
========================================== */

export const createDieta = async (
  req,
  res
) => {

  try {

    const {

      nombre,
      descripcion,
      calorias,
      objetivo,
      imagen,
      alimentos,
      comidas

    } = req.body;

    if (!nombre?.trim()) {

      return res.status(400).json({

        message:
          'El nombre de la dieta es obligatorio'

      });

    }

    if (
      calorias === undefined ||
      calorias === null ||
      Number(calorias) < 0
    ) {

      return res.status(400).json({

        message:
          'Las calorías son obligatorias y deben ser válidas'

      });

    }

    const [result] =
      await connmysql.query(`

        INSERT INTO dietas
        (

          nombre,
          descripcion,
          calorias,
          objetivo,
          imagen,
          alimentos,
          comidas,
          estado

        )

        VALUES (?, ?, ?, ?, ?, ?, ?, 1)

      `, [

        nombre.trim(),

        descripcion?.trim() ?? '',

        Number(calorias),

        objetivo?.trim() ?? '',

        imagen ?? '',

        alimentos?.trim() ?? '',

        comidas?.trim() ?? ''

      ]);

    await guardarHistorial(

      req.usuario.id_usuario,

      'DIETAS',

      'CREAR',

      `Registró la dieta "${nombre.trim()}"`

    );

    return res.status(201).json({

      message:
        'Dieta registrada correctamente',

      id_dieta:
        result.insertId

    });

  } catch (error) {

    console.error(
      'Error al registrar dieta:',
      error
    );

    return res.status(500).json({

      message:
        'Error al registrar dieta',

      error:
        error.message

    });

  }

};


/* ==========================================
   ACTUALIZAR DIETA
========================================== */

export const updateDieta = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;

    const {

      nombre,
      descripcion,
      calorias,
      objetivo,
      imagen,
      alimentos,
      comidas,
      estado

    } = req.body;

    if (!nombre?.trim()) {

      return res.status(400).json({

        message:
          'El nombre de la dieta es obligatorio'

      });

    }

    if (
      calorias === undefined ||
      calorias === null ||
      Number(calorias) < 0
    ) {

      return res.status(400).json({

        message:
          'Las calorías son obligatorias y deben ser válidas'

      });

    }

    const [existente] =
      await connmysql.query(`

        SELECT

          id_dieta,
          imagen,
          estado

        FROM dietas

        WHERE id_dieta = ?

      `, [id]);

    if (
      existente.length === 0
    ) {

      return res.status(404).json({

        message:
          'Dieta no encontrada'

      });

    }

    /*
     * Conserva la imagen anterior cuando Angular
     * no envía una imagen nueva.
     */
    const imagenFinal =

      imagen !== undefined &&
      imagen !== null

        ? imagen

        : existente[0].imagen;

    /*
     * Conserva el estado anterior cuando no se envía.
     */
    const estadoFinal =

      estado !== undefined &&
      estado !== null

        ? estado

        : existente[0].estado;

    const [result] =
      await connmysql.query(`

        UPDATE dietas

        SET

          nombre = ?,
          descripcion = ?,
          calorias = ?,
          objetivo = ?,
          imagen = ?,
          alimentos = ?,
          comidas = ?,
          estado = ?

        WHERE id_dieta = ?

      `, [

        nombre.trim(),

        descripcion?.trim() ?? '',

        Number(calorias),

        objetivo?.trim() ?? '',

        imagenFinal ?? '',

        alimentos?.trim() ?? '',

        comidas?.trim() ?? '',

        estadoFinal,

        id

      ]);

    if (
      result.affectedRows === 0
    ) {

      return res.status(404).json({

        message:
          'Dieta no encontrada'

      });

    }

    await guardarHistorial(

      req.usuario.id_usuario,

      'DIETAS',

      'ACTUALIZAR',

      `Actualizó la dieta "${nombre.trim()}"`

    );

    return res.json({

      message:
        'Dieta actualizada correctamente'

    });

  } catch (error) {

    console.error(
      'Error al actualizar dieta:',
      error
    );

    return res.status(500).json({

      message:
        'Error al actualizar dieta',

      error:
        error.message

    });

  }

};


/* ==========================================
   ELIMINAR DIETA
========================================== */

export const deleteDieta = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;

    const [result] =
      await connmysql.query(`

        UPDATE dietas

        SET estado = 0

        WHERE id_dieta = ?

      `, [id]);

    if (
      result.affectedRows === 0
    ) {

      return res.status(404).json({

        message:
          'Dieta no encontrada'

      });

    }

    await guardarHistorial(

      req.usuario.id_usuario,

      'DIETAS',

      'ELIMINAR',

      `Eliminó la dieta ID ${id}`

    );

    return res.json({

      message:
        'Dieta eliminada correctamente'

    });

  } catch (error) {

    console.error(
      'Error al eliminar dieta:',
      error
    );

    return res.status(500).json({

      message:
        'Error al eliminar dieta',

      error:
        error.message

    });

  }

};


/* ==========================================
   ASIGNAR DIETA A UN USUARIO
========================================== */

export const asignarDietaUsuario = async (
  req,
  res
) => {

  try {

    const {

      id_usuario,
      id_dieta,
      fecha_inicio,
      fecha_fin,
      recomendaciones

    } = req.body;

    if (!id_usuario) {

      return res.status(400).json({

        message:
          'Debe seleccionar un cliente'

      });

    }

    if (!id_dieta) {

      return res.status(400).json({

        message:
          'Debe seleccionar una dieta'

      });

    }

    if (
      !fecha_inicio ||
      !fecha_fin
    ) {

      return res.status(400).json({

        message:
          'Las fechas de inicio y fin son obligatorias'

      });

    }

    if (
      new Date(fecha_fin) <
      new Date(fecha_inicio)
    ) {

      return res.status(400).json({

        message:
          'La fecha de fin no puede ser anterior a la fecha de inicio'

      });

    }

    /*
     * Verificar que el usuario exista.
     */
    const [usuarios] =
      await connmysql.query(`

        SELECT id_usuario

        FROM usuarios

        WHERE id_usuario = ?

      `, [id_usuario]);

    if (
      usuarios.length === 0
    ) {

      return res.status(404).json({

        message:
          'El usuario seleccionado no existe'

      });

    }

    /*
     * Verificar que la dieta exista y esté activa.
     */
    const [dietas] =
      await connmysql.query(`

        SELECT

          id_dieta,
          nombre

        FROM dietas

        WHERE

          id_dieta = ?

          AND estado = 1

      `, [id_dieta]);

    if (
      dietas.length === 0
    ) {

      return res.status(404).json({

        message:
          'La dieta seleccionada no existe o está inactiva'

      });

    }

    /*
     * Desactivar asignaciones anteriores.
     * No se eliminan: seguirán apareciendo en el historial.
     */
    await connmysql.query(`

      UPDATE usuario_dieta

      SET estado = 'Inactiva'

      WHERE

        id_usuario = ?

        AND estado = 'Activa'

    `, [id_usuario]);

    /*
     * Registrar la nueva dieta activa.
     */
    const [result] =
      await connmysql.query(`

        INSERT INTO usuario_dieta
        (

          id_usuario,
          id_dieta,
          fecha_inicio,
          fecha_fin,
          recomendaciones,
          estado

        )

        VALUES (?, ?, ?, ?, ?, 'Activa')

      `, [

        Number(id_usuario),

        Number(id_dieta),

        fecha_inicio,

        fecha_fin,

        recomendaciones?.trim() ?? ''

      ]);

    await guardarHistorial(

      req.usuario.id_usuario,

      'DIETAS',

      'ASIGNAR',

      `Asignó la dieta "${dietas[0].nombre}" al usuario ID ${id_usuario}`

    );

    return res.status(201).json({

      message:
        'Dieta asignada correctamente',

      id_usuario_dieta:
        result.insertId

    });

  } catch (error) {

    console.error(
      'Error al asignar dieta:',
      error
    );

    return res.status(500).json({

      message:
        'Error al asignar dieta',

      error:
        error.message

    });

  }

};


/* ==========================================
   DIETAS ASIGNADAS A UN USUARIO
========================================== */

export const getDietasUsuario = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;

    /*
     * Esta consulta no obtiene todas las dietas.
     * Obtiene únicamente las asignaciones del cliente
     * indicado en el parámetro :id.
     */
    const [rows] =
      await connmysql.query(`

        SELECT

          ud.id_usuario_dieta,

          ud.id_usuario,

          CONCAT(
            u.nombres,
            ' ',
            u.apellidos
          ) AS usuario,

          ud.id_dieta,

          d.nombre,

          d.descripcion,

          d.calorias,

          d.objetivo,

          d.imagen,

          d.alimentos,

          d.comidas,

          ud.fecha_inicio,

          ud.fecha_fin,

          ud.recomendaciones,

          ud.estado

        FROM usuario_dieta ud

        INNER JOIN usuarios u

          ON u.id_usuario =
             ud.id_usuario

        INNER JOIN dietas d

          ON d.id_dieta =
             ud.id_dieta

        WHERE ud.id_usuario = ?

        ORDER BY

          ud.fecha_inicio DESC,

          ud.id_usuario_dieta DESC

      `, [id]);

    return res.json(rows);

  } catch (error) {

    console.error(
      'Error al obtener dietas del usuario:',
      error
    );

    return res.status(500).json({

      message:
        'Error al obtener dietas del usuario',

      error:
        error.message

    });

  }

};


/* ==========================================
   MI DIETA ACTIVA Y VIGENTE
========================================== */

export const getMiDieta = async (
  req,
  res
) => {

  try {

    const id_usuario =
      req.usuario.id_usuario;

    const [rows] =
      await connmysql.query(`

        SELECT

          ud.id_usuario_dieta,

          ud.id_usuario,

          ud.fecha_inicio,

          ud.fecha_fin,

          ud.recomendaciones,

          ud.estado,

          d.id_dieta,

          d.nombre,

          d.descripcion,

          d.calorias,

          d.objetivo,

          d.imagen,

          d.alimentos,

          d.comidas

        FROM usuario_dieta ud

        INNER JOIN dietas d

          ON d.id_dieta =
             ud.id_dieta

        WHERE

          ud.id_usuario = ?

          AND ud.estado = 'Activa'

          AND d.estado = 1

          AND CURDATE()
              BETWEEN ud.fecha_inicio
              AND ud.fecha_fin

        ORDER BY

          ud.fecha_inicio DESC,

          ud.id_usuario_dieta DESC

        LIMIT 1

      `, [id_usuario]);

    if (
      rows.length === 0
    ) {

      return res.json(null);

    }

    return res.json(
      rows[0]
    );

  } catch (error) {

    console.error(
      'Error al obtener mi dieta:',
      error
    );

    return res.status(500).json({

      message:
        'Error al obtener la dieta',

      error:
        error.message

    });

  }

};