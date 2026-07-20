import { Router } from 'express';
import {
  getEntrenadores,
  getEntrenadorById
} from '../controladores/entrenadoresCtrl.js';
import { verifyToken } from '../jwt/verifyToken.js';

const router = Router();

router.get('/entrenadores', verifyToken, getEntrenadores);
router.get('/entrenadores/:id', verifyToken, getEntrenadorById);

export default router;