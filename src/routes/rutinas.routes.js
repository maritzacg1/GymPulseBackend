import { Router } from 'express';
import {
  getRutinas,
  getRutinaDetalle,
  createRutina,
  updateRutina,
  deleteRutina,
  agregarEjercicioRutina,
  eliminarEjercicioRutina,
  getMisRutinas,
  asignarRutina,
  getRutinasAsignadas,
  eliminarRutinaAsignada
} from '../controladores/rutinasCtrl.js';
import { verifyToken } from '../jwt/verifyToken.js';

const router = Router();

router.get('/rutinas', verifyToken, getRutinas);
router.get('/rutinas/:id', verifyToken, getRutinaDetalle);
router.post('/rutinas', verifyToken, createRutina);
router.put('/rutinas/:id', verifyToken, updateRutina);
router.delete('/rutinas/:id', verifyToken, deleteRutina);
router.post('/rutinas/ejercicio', verifyToken, agregarEjercicioRutina);
router.delete('/rutinas/ejercicio/:id', verifyToken, eliminarEjercicioRutina);
router.get(
  '/mis-rutinas',
  verifyToken,
  getMisRutinas
);

router.post(
  '/asignar-rutina',
  verifyToken,
  asignarRutina
);

router.get(
  '/rutinas-asignadas',
  verifyToken,
  getRutinasAsignadas
);

router.delete(
  '/rutinas-asignadas/:id',
  verifyToken,
  eliminarRutinaAsignada
);

export default router;