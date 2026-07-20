import { Router } from 'express';
import {
  ingresosPorMes,
  asistenciasPorFecha,
  clientesMembresiaVencida
} from '../controladores/reportesCtrl.js';
import { verifyToken } from '../jwt/verifyToken.js';

const router = Router();

router.get('/reportes/ingresos-mes', verifyToken, ingresosPorMes);
router.get('/reportes/asistencias-fecha', verifyToken, asistenciasPorFecha);
router.get('/reportes/membresias-vencidas', verifyToken, clientesMembresiaVencida);

export default router;