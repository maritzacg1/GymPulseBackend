import { Router } from 'express';
import { getProgresoUsuario } from '../controladores/progresoCtrl.js';
import { verifyToken } from '../jwt/verifyToken.js';

const router = Router();

router.get('/progreso/:id', verifyToken, getProgresoUsuario);

export default router;