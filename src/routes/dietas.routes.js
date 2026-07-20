import { Router } from 'express';
import {
  getDietas,
  getDietaById,
  createDieta,
  updateDieta,
  deleteDieta,
  getDietasUsuario
} from '../controladores/dietasCtrl.js';
import { verifyToken } from '../jwt/verifyToken.js';

const router = Router();

router.get('/dietas', verifyToken, getDietas);
router.get('/dietas/:id', verifyToken, getDietaById);
router.post('/dietas', verifyToken, createDieta);
router.put('/dietas/:id', verifyToken, updateDieta);
router.delete('/dietas/:id', verifyToken, deleteDieta);

router.get('/dietas/usuario/:id', verifyToken, getDietasUsuario);

export default router;