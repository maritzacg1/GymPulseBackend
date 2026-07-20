import { Router } from 'express';
import { verifyToken } from '../jwt/verifyToken.js';
import {
  getDashboard,
  ultimosUsuarios,
  ultimosPagos,
  ultimasAsistencias,
  ingresosMensuales
} from '../controladores/dashboardCtrl.js';

const router = Router();

router.get('/dashboard', verifyToken, getDashboard);
router.get('/dashboard/usuarios', verifyToken, ultimosUsuarios);
router.get('/dashboard/pagos', verifyToken, ultimosPagos);
router.get('/dashboard/asistencias', verifyToken, ultimasAsistencias);
router.get('/dashboard/ingresos', verifyToken, ingresosMensuales);

export default router;