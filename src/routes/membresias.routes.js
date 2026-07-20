import { Router } from 'express';
import {
  getMembresias,
  getMembresiaById,
  createMembresia,
  updateMembresia,
  deleteMembresia,
  asignarMembresiaUsuario,
  getMembresiasUsuario,
   getMiMembresia
} from '../controladores/membresiasCtrl.js';
import { verifyToken } from '../jwt/verifyToken.js';

const router = Router();

router.get('/membresias', verifyToken, getMembresias);
router.post('/membresias/asignar', verifyToken, asignarMembresiaUsuario);
router.get('/membresias/usuario/:id', verifyToken, getMembresiasUsuario);
router.get('/membresias/:id', verifyToken, getMembresiaById);
router.post('/membresias', verifyToken, createMembresia);
router.put('/membresias/:id', verifyToken, updateMembresia);
router.delete('/membresias/:id', verifyToken, deleteMembresia);
router.get(
  '/mi-membresia',
  verifyToken,
  getMiMembresia
);
export default router;