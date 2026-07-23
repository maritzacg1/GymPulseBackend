import { connmysql } from '../db.js';
import { guardarHistorial } from './historialCtrl.js';
import PDFDocument from 'pdfkit';

/* ==========================================
   LISTAR PAGOS
========================================== */

export const getPagos = async (req, res) => {

  try {

    const [rows] = await connmysql.query(`

      SELECT
        p.id_pago,
        p.id_usuario,
        p.id_membresia,
        p.monto,
        p.metodo_pago,
        p.comprobante,
        p.fecha_pago,
        p.estado,

        u.nombres,
        u.apellidos,
        u.cedula,

        m.nombre AS membresia

      FROM pagos p

      INNER JOIN usuarios u
        ON p.id_usuario = u.id_usuario

      LEFT JOIN membresias m
        ON p.id_membresia = m.id_membresia

      ORDER BY p.fecha_pago DESC

    `);

    res.json(rows);

  } catch (error) {

    res.status(500).json({
      message: 'Error al listar pagos',
      error: error.message
    });

  }

};


/* ==========================================
   OBTENER PAGO
========================================== */

export const getPagoById = async (req, res) => {

  try {

    const { id } = req.params;

    const [rows] = await connmysql.query(
      `SELECT * FROM pagos WHERE id_pago = ?`,
      [id]
    );

    if (rows.length === 0) {

      return res.status(404).json({
        message: 'Pago no encontrado'
      });

    }

    res.json(rows[0]);

  } catch (error) {

    res.status(500).json({
      message: 'Error al buscar pago',
      error: error.message
    });

  }

};


/* ==========================================
   CREAR PAGO
========================================== */

export const createPago = async (req, res) => {

  try {

    const {
      id_usuario,
      id_membresia,
      monto,
      metodo_pago,
      estado,
      comprobante
    } = req.body;

    const [result] = await connmysql.query(

      `INSERT INTO pagos
      (
        id_usuario,
        id_membresia,
        monto,
        metodo_pago,
        estado,
        comprobante
      )
      VALUES (?, ?, ?, ?, ?, ?)`,

      [
        id_usuario,
        id_membresia,
        monto,
        metodo_pago,
        estado || 'Pagado',
        comprobante || null
      ]

    );

    await guardarHistorial(

      req.usuario.id_usuario,

      'PAGOS',

      'CREAR',

      `Registró un pago de $${monto}`

    );

    res.status(201).json({

      message: 'Pago registrado correctamente',

      id_pago: result.insertId

    });

  } catch (error) {

    res.status(500).json({

      message: 'Error al registrar pago',

      error: error.message

    });

  }

};


/* ==========================================
   ACTUALIZAR PAGO
========================================== */

export const updatePago = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      id_usuario,
      id_membresia,
      monto,
      metodo_pago,
      estado,
      comprobante
    } = req.body;

    const [result] = await connmysql.query(

      `UPDATE pagos SET

        id_usuario = ?,
        id_membresia = ?,
        monto = ?,
        metodo_pago = ?,
        estado = ?,
        comprobante = ?

      WHERE id_pago = ?`,

      [
        id_usuario,
        id_membresia,
        monto,
        metodo_pago,
        estado,
        comprobante || null,
        id
      ]

    );

    if (result.affectedRows === 0) {

      return res.status(404).json({

        message: 'Pago no encontrado'

      });

    }

    await guardarHistorial(

      req.usuario.id_usuario,

      'PAGOS',

      'ACTUALIZAR',

      `Actualizó el pago ID ${id}`

    );

    res.json({

      message: 'Pago actualizado correctamente'

    });

  } catch (error) {

    res.status(500).json({

      message: 'Error al actualizar pago',

      error: error.message

    });

  }

};


/* ==========================================
   ANULAR PAGO
========================================== */

export const deletePago = async (req, res) => {

  try {

    const { id } = req.params;

    const [result] = await connmysql.query(

      `UPDATE pagos
       SET estado = 'Anulado'
       WHERE id_pago = ?`,

      [id]

    );

    if (result.affectedRows === 0) {

      return res.status(404).json({

        message: 'Pago no encontrado'

      });

    }

    await guardarHistorial(

      req.usuario.id_usuario,

      'PAGOS',

      'ANULAR',

      `Anuló el pago ID ${id}`

    );

    res.json({

      message: 'Pago anulado correctamente'

    });

  } catch (error) {

    res.status(500).json({

      message: 'Error al anular pago',

      error: error.message

    });

  }

};
export const generarPDFPago = async (req, res) => {

  try {

    const { id } = req.params;

    const [rows] = await connmysql.query(`

      SELECT

        p.*,

        u.nombres,
        u.apellidos,
        u.cedula,
        u.correo,

        m.nombre AS membresia,
        m.descripcion,
        m.duracion_dias

      FROM pagos p

      INNER JOIN usuarios u
      ON p.id_usuario=u.id_usuario

      LEFT JOIN membresias m
      ON p.id_membresia=m.id_membresia

      WHERE p.id_pago=?

    `,[id]);

    if(rows.length===0){

      return res.status(404).json({

        message:'Pago no encontrado'

      });

    }

    const pago=rows[0];

    const doc=new PDFDocument({

      margin:50

    });

    res.setHeader(

      'Content-Type',

      'application/pdf'

    );

    res.setHeader(

      'Content-Disposition',

      `attachment; filename=ComprobantePago_${id}.pdf`

    );

    doc.pipe(res);

    doc
      .fontSize(24)
      .text('GYMPULSE AI',{

        align:'center'

      });

    doc.moveDown();

    doc
      .fontSize(18)
      .text('COMPROBANTE DE PAGO',{

        align:'center'

      });

    doc.moveDown(2);

    doc.fontSize(13);

    doc.text(`Cliente: ${pago.nombres} ${pago.apellidos}`);

    doc.text(`Cédula: ${pago.cedula}`);

    doc.text(`Correo: ${pago.correo}`);

    doc.moveDown();

    doc.text(`Membresía: ${pago.membresia}`);

    doc.text(`Descripción: ${pago.descripcion}`);

    doc.text(`Duración: ${pago.duracion_dias} días`);

    doc.moveDown();

    doc.text(`Monto: $${pago.monto}`);

    doc.text(`Método de pago: ${pago.metodo_pago}`);

    doc.text(`Estado: ${pago.estado}`);

    doc.text(`Fecha: ${new Date(pago.fecha_pago).toLocaleDateString()}`);

    doc.moveDown(2);

    doc.fontSize(11);

    doc.text(

      'Gracias por confiar en GymPulse AI.',

      {

        align:'center'

      }

    );

    doc.end();

  }

  catch(error){

    res.status(500).json({

      message:'Error al generar PDF',

      error:error.message

    });

  }

};