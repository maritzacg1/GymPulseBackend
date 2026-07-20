import { Router } from 'express';
import {
  getEjercicios,
  getEjercicioById,
  createEjercicio,
  updateEjercicio,
  deleteEjercicio
} from '../controladores/ejerciciosCtrl.js';
import { verifyToken } from '../jwt/verifyToken.js';

const router = Router();

router.get('/ejercicios', verifyToken, getEjercicios);
router.get('/ejercicios/:id', verifyToken, getEjercicioById);
router.post('/ejercicios', verifyToken, createEjercicio);
router.put('/ejercicios/:id', verifyToken, updateEjercicio);
router.delete('/ejercicios/:id', verifyToken, deleteEjercicio);

export default router;