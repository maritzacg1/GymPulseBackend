import { connmysql } from '../db.js';
import { guardarHistorial } from './historialCtrl.js';

/* ==========================================
   LISTAR DIETAS
========================================== */

export const getDietas = async (req, res) => {

  try {

    const [rows] = await connmysql.query(`

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

      ORDER BY nombre

    `);

    res.json(rows);

  }

  catch (error) {

    res.status(500).json({

      message: 'Error al listar dietas',

      error: error.message

    });

  }

};


/* ==========================================
   BUSCAR DIETA
========================================== */

export const getDietaById = async (req, res) => {

  try {

    const { id } = req.params;

    const [rows] = await connmysql.query(`

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

    `,[id]);

    if(rows.length===0){

      return res.status(404).json({

        message:'Dieta no encontrada'

      });

    }

    res.json(rows[0]);

  }

  catch(error){

    res.status(500).json({

      message:'Error al buscar dieta',

      error:error.message

    });

  }

};


/* ==========================================
   CREAR DIETA
========================================== */

export const createDieta = async (req,res)=>{

  try{

    const{

      nombre,
      descripcion,
      calorias,
      objetivo,
      imagen,
      alimentos,
      comidas

    }=req.body;

    const [result]=await connmysql.query(`

      INSERT INTO dietas(

        nombre,
        descripcion,
        calorias,
        objetivo,
        imagen,
        alimentos,
        comidas

      )

      VALUES(?,?,?,?,?,?,?)

    `,[

      nombre,
      descripcion,
      calorias,
      objetivo,
      imagen || '',
      alimentos || '',
      comidas || ''

    ]);

    await guardarHistorial(

      req.usuario.id_usuario,

      'DIETAS',

      'CREAR',

      `Registró la dieta "${nombre}"`

    );

    res.status(201).json({

      message:'Dieta registrada correctamente',

      id_dieta:result.insertId

    });

  }

  catch(error){

    res.status(500).json({

      message:'Error al registrar dieta',

      error:error.message

    });

  }

};
/* ==========================================
   ACTUALIZAR DIETA
========================================== */

export const updateDieta = async (req, res) => {

  try {

    const { id } = req.params;

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

    const [result] = await connmysql.query(`

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

    `,[

      nombre,
      descripcion,
      calorias,
      objetivo,
      imagen || '',
      alimentos || '',
      comidas || '',
      estado,
      id

    ]);

    if(result.affectedRows===0){

      return res.status(404).json({

        message:'Dieta no encontrada'

      });

    }

    await guardarHistorial(

      req.usuario.id_usuario,

      'DIETAS',

      'ACTUALIZAR',

      `Actualizó la dieta "${nombre}"`

    );

    res.json({

      message:'Dieta actualizada correctamente'

    });

  }

  catch(error){

    res.status(500).json({

      message:'Error al actualizar dieta',

      error:error.message

    });

  }

};


/* ==========================================
   ELIMINAR DIETA
========================================== */

export const deleteDieta = async (req,res)=>{

  try{

    const { id } = req.params;

    const [result] = await connmysql.query(`

      UPDATE dietas

      SET estado = 0

      WHERE id_dieta = ?

    `,[id]);

    if(result.affectedRows===0){

      return res.status(404).json({

        message:'Dieta no encontrada'

      });

    }

    await guardarHistorial(

      req.usuario.id_usuario,

      'DIETAS',

      'ELIMINAR',

      `Eliminó la dieta ID ${id}`

    );

    res.json({

      message:'Dieta eliminada correctamente'

    });

  }

  catch(error){

    res.status(500).json({

      message:'Error al eliminar dieta',

      error:error.message

    });

  }

};
/* ==========================================
   ASIGNAR DIETA A UN USUARIO
========================================== */

export const asignarDietaUsuario = async (req, res) => {

  try {

    const {

      id_usuario,
      id_dieta,
      fecha_inicio,
      fecha_fin,
      recomendaciones

    } = req.body;

    const [result] = await connmysql.query(`

      INSERT INTO usuario_dieta
      (

        id_usuario,
        id_dieta,
        fecha_inicio,
        fecha_fin,
        recomendaciones,
        estado

      )

      VALUES (?,?,?,?,?,'Activa')

    `,[

      id_usuario,
      id_dieta,
      fecha_inicio,
      fecha_fin,
      recomendaciones || ''

    ]);

    await guardarHistorial(

      req.usuario.id_usuario,

      'DIETAS',

      'ASIGNAR',

      `Asignó la dieta ID ${id_dieta} al usuario ID ${id_usuario}`

    );

    res.status(201).json({

      message:'Dieta asignada correctamente',

      id_usuario_dieta: result.insertId

    });

  }

  catch(error){

    res.status(500).json({

      message:'Error al asignar dieta',

      error:error.message

    });

  }

};


/* ==========================================
   DIETAS DE UN USUARIO
========================================== */

export const getDietasUsuario = async (req, res) => {

  try {

    const { id } = req.params;

    const [rows] = await connmysql.query(`

      SELECT

        ud.id_usuario_dieta,

        u.id_usuario,

        CONCAT(u.nombres,' ',u.apellidos) AS usuario,

        d.id_dieta,

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

        ON ud.id_usuario = u.id_usuario

      INNER JOIN dietas d

        ON ud.id_dieta = d.id_dieta

      WHERE ud.id_usuario = ?

      ORDER BY ud.fecha_inicio DESC

    `,[id]);

    res.json(rows);

  }

  catch(error){

    res.status(500).json({

      message:'Error al obtener dietas del usuario',

      error:error.message

    });

  }

};
/* ==========================================
   MI DIETA (CLIENTE)
========================================== */

export const getMiDieta = async (req, res) => {

  try {

    const id_usuario = req.usuario.id_usuario;

    const [rows] = await connmysql.query(`

      SELECT

        ud.id_usuario_dieta,

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

        ON ud.id_dieta = d.id_dieta

      WHERE

        ud.id_usuario = ?

        AND ud.estado = 'Activa'

      ORDER BY ud.fecha_fin DESC

      LIMIT 1

    `,[id_usuario]);

    if(rows.length===0){

      return res.json(null);

    }

    res.json(rows[0]);

  }

  catch(error){

    res.status(500).json({

      message:'Error al obtener la dieta',

      error:error.message

    });

  }

};