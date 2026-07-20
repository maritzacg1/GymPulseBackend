import { connmysql } from '../db.js';

export const getDashboard = async (req, res) => {
  try {
    const [[usuarios]] = await connmysql.query(
      `SELECT COUNT(*) AS total FROM usuarios WHERE estado = 1`
    );

    const [[clientes]] = await connmysql.query(
      `SELECT COUNT(*) AS total FROM usuarios WHERE id_rol = 3 AND estado = 1`
    );

    const [[entrenadores]] = await connmysql.query(
      `SELECT COUNT(*) AS total FROM entrenadores`
    );

    const [[rutinas]] = await connmysql.query(
      `SELECT COUNT(*) AS total FROM rutinas WHERE estado = 1`
    );

    const [[ejercicios]] = await connmysql.query(
      `SELECT COUNT(*) AS total FROM ejercicios WHERE estado = 1`
    );

    const [[pagosHoy]] = await connmysql.query(
      `SELECT IFNULL(SUM(monto), 0) AS total FROM pagos WHERE DATE(fecha_pago) = CURDATE() AND estado = 'Pagado'`
    );

    const [[asistenciasHoy]] = await connmysql.query(
      `SELECT COUNT(*) AS total FROM asistencias WHERE fecha = CURDATE()`
    );

    res.json({
      usuarios: usuarios.total,
      clientes: clientes.total,
      entrenadores: entrenadores.total,
      rutinas: rutinas.total,
      ejercicios: ejercicios.total,
      pagosHoy: pagosHoy.total,
      asistenciasHoy: asistenciasHoy.total
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener dashboard',
      error: error.message
    });
  }
};
export const ultimosUsuarios = async (req, res) => {
  try {

    const [rows] = await connmysql.query(`
      SELECT
      id_usuario,
      nombres,
      apellidos,
      correo,
      fecha_registro
      FROM usuarios
      ORDER BY fecha_registro DESC
      LIMIT 5
    `);

    res.json(rows);

  } catch (error) {

    res.status(500).json({
      message: 'Error al obtener usuarios',
      error: error.message
    });

  }
};
export const ultimosPagos = async (req, res) => {
  try {

    const [rows] = await connmysql.query(`
      SELECT
      id_pago,
      id_usuario,
      monto,
      metodo_pago,
      fecha_pago,
      estado
      FROM pagos
      ORDER BY fecha_pago DESC
      LIMIT 5
    `);

    res.json(rows);

  } catch (error) {

    res.status(500).json({
      message: 'Error al obtener pagos',
      error: error.message
    });

  }
};
export const ultimasAsistencias = async (req, res) => {
  try {

    const [rows] = await connmysql.query(`
      SELECT
      a.id_asistencia,
      CONCAT(u.nombres,' ',u.apellidos) usuario,
      a.fecha,
      a.hora_entrada
      FROM asistencias a
      INNER JOIN usuarios u
      ON a.id_usuario=u.id_usuario
      ORDER BY a.fecha DESC
      LIMIT 5
    `);

    res.json(rows);

  } catch (error) {

    res.status(500).json({
      message: 'Error al obtener asistencias',
      error: error.message
    });

  }
};
export const ingresosMensuales = async (req, res) => {
  try {

    const [rows] = await connmysql.query(`
      SELECT
      MONTH(fecha_pago) mes,
      SUM(monto) total
      FROM pagos
      WHERE estado='Pagado'
      GROUP BY MONTH(fecha_pago)
      ORDER BY mes
    `);

    res.json(rows);

  } catch (error) {

    res.status(500).json({
      message: 'Error ingresos mensuales',
      error: error.message
    });

  }
};