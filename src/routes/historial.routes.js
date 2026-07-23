import { Router } from 'express';

import {
  getHistorial,
  registrarHistorialApi
} from '../controladores/historialCtrl.js';

import { verifyToken } from '../jwt/verifyToken.js';


const router = Router();



router.get(
  '/historial',
  verifyToken,
  getHistorial
);



router.post(
  '/historial',
  verifyToken,
  registrarHistorialApi
);



export default router;