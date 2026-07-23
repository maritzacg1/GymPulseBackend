import { Router } from 'express';

import {
  getPagos,
  getPagoById,
  createPago,
  updatePago,
  deletePago,
  generarPDFPago,
  getMisPagos
} from '../controladores/pagosCtrl.js';

import { verifyToken } from '../jwt/verifyToken.js';

const router = Router();

router.get('/pagos', verifyToken, getPagos);

router.get('/pagos/:id', verifyToken, getPagoById);


router.post('/pagos', verifyToken, createPago);

router.put('/pagos/:id', verifyToken, updatePago);

router.delete('/pagos/:id', verifyToken, deletePago);

router.get('/pagos/:id/pdf', verifyToken, generarPDFPago);
router.get(
  '/mis-pagos',
  verifyToken,
  getMisPagos
);
export default router;