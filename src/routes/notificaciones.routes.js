import { Router } from 'express';
import { 
  getNotificacionesUsuario, 
  marcarNotificacionLeida 
} from '../controladores/notificacionesCtrl.js';
import { verifyToken } from '../jwt/verifyToken.js';

const router = Router();

router.get('/notificaciones/usuario/:id', verifyToken, getNotificacionesUsuario);
router.put('/notificaciones/:id/leida', verifyToken, marcarNotificacionLeida);

export default router;