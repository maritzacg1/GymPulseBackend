import { Router } from 'express';
import { getAsistencias, registrarAsistenciaQR ,getMisAsistencias} from '../controladores/asistenciasCtrl.js';
import { verifyToken } from '../jwt/verifyToken.js';

const router = Router();

router.get('/asistencias', verifyToken, getAsistencias);
router.post('/asistencias/qr', verifyToken, registrarAsistenciaQR);
router.get(
  '/mis-asistencias',
  verifyToken,
  getMisAsistencias
);

export default router;