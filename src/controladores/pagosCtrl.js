import { connmysql } from '../db.js';
import { guardarHistorial } from './historialCtrl.js';
export const getPagos = async (req, res) => {
  try {
    const [rows] = await connmysql.query(`
      SELECT 
        p.id_pago,
        p.id_usuario,
        p.id_membresia,
        p.monto,
        p.metodo_pago,
        p.fecha_pago,
        p.estado,
        u.nombres,
        u.apellidos,
        u.cedula,
        m.nombre AS membresia
      FROM pagos p
      INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
      LEFT JOIN membresias m ON p.id_membresia = m.id_membresia
      ORDER BY p.fecha_pago DESC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar pagos', error: error.message });
  }
};

export const getPagoById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await connmysql.query(
      `SELECT * FROM pagos WHERE id_pago = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar pago', error: error.message });
  }
};

export const createPago = async (req, res) => {
  try {
    const { id_usuario, id_membresia, monto, metodo_pago, estado } = req.body;

    const [result] = await connmysql.query(
      `INSERT INTO pagos 
      (id_usuario, id_membresia, monto, metodo_pago, estado)
      VALUES (?, ?, ?, ?, ?)`,
      [id_usuario, id_membresia, monto, metodo_pago, estado || 'Pagado']
    );
await registrarActividad(

    req.usuario.id_usuario,

    'Pagos',

    'Registrar',

    `Registró un pago de $${monto}`

);
    res.status(201).json({
      message: 'Pago registrado correctamente',
      id_pago: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar pago', error: error.message });
  }
};

export const updatePago = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario, id_membresia, monto, metodo_pago, estado } = req.body;

    const [result] = await connmysql.query(
      `UPDATE pagos SET
        id_usuario = ?,
        id_membresia = ?,
        monto = ?,
        metodo_pago = ?,
        estado = ?
      WHERE id_pago = ?`,
      [id_usuario, id_membresia, monto, metodo_pago, estado, id]
    );
await registrarActividad(

    req.usuario.id_usuario,

    'Pagos',

    'Actualizar',

    `Actualizó el pago ID ${id}`

);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }

    res.json({ message: 'Pago actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar pago', error: error.message });
  }
};

export const deletePago = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await connmysql.query(
      `UPDATE pagos SET estado = 'Anulado' WHERE id_pago = ?`,
      [id]
    );
await registrarActividad(

    req.usuario.id_usuario,

    'Pagos',

    'Anular',

    `Anuló el pago ID ${id}`

);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }

    res.json({ message: 'Pago anulado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al anular pago', error: error.message });
  }
};