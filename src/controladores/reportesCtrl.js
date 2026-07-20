import { connmysql } from '../db.js';

export const ingresosPorMes = async (req, res) => {
  try {
    const [rows] = await connmysql.query(`
      SELECT 
        DATE_FORMAT(fecha_pago, '%Y-%m') AS mes,
        SUM(monto) AS total
      FROM pagos
      WHERE estado = 'Pagado'
      GROUP BY DATE_FORMAT(fecha_pago, '%Y-%m')
      ORDER BY mes DESC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ingresos por mes', error: error.message });
  }
};

export const asistenciasPorFecha = async (req, res) => {
  try {
    const [rows] = await connmysql.query(`
      SELECT 
        fecha,
        COUNT(*) AS total_asistencias
      FROM asistencias
      GROUP BY fecha
      ORDER BY fecha DESC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener asistencias', error: error.message });
  }
};

export const clientesMembresiaVencida = async (req, res) => {
  try {
    const [rows] = await connmysql.query(`
      SELECT 
        u.id_usuario,
        CONCAT(u.nombres, ' ', u.apellidos) AS cliente,
        u.cedula,
        u.telefono,
        m.nombre AS membresia,
        um.fecha_inicio,
        um.fecha_fin,
        um.estado
      FROM usuario_membresia um
      INNER JOIN usuarios u ON um.id_usuario = u.id_usuario
      INNER JOIN membresias m ON um.id_membresia = m.id_membresia
      WHERE um.fecha_fin < CURDATE()
      ORDER BY um.fecha_fin DESC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener membresías vencidas', error: error.message });
  }
};