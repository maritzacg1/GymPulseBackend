import { Router } from 'express';
import {
  getPagos,
  getPagoById,
  createPago,
  updatePago,
  deletePago
} from '../controladores/pagosCtrl.js';
import { verifyToken } from '../jwt/verifyToken.js';

const router = Router();

router.get('/pagos', verifyToken, getPagos);
router.get('/pagos/:id', verifyToken, getPagoById);
router.post('/pagos', verifyToken, createPago);
router.put('/pagos/:id', verifyToken, updatePago);
router.delete('/pagos/:id', verifyToken, deletePago);

export default router;