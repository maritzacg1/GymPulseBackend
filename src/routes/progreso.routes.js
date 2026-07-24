import {
  Router
} from 'express';

import {

  getProgresos,
  getProgresoUsuario,
  getProgresoById,
  createProgreso,
  updateProgreso,
  deleteProgreso,
  getMiProgreso

} from '../controladores/progresoFisicoCtrl.js';

import {
  verifyToken
} from '../jwt/verifyToken.js';

const router =
  Router();

/* ==========================================
   ENTRENADORES Y ADMINISTRADORES
========================================== */

router.get(
  '/progreso-fisico',
  verifyToken,
  getProgresos
);

router.get(
  '/progreso-fisico/usuario/:id',
  verifyToken,
  getProgresoUsuario
);

router.get(
  '/progreso-fisico/:id',
  verifyToken,
  getProgresoById
);

router.post(
  '/progreso-fisico',
  verifyToken,
  createProgreso
);

router.put(
  '/progreso-fisico/:id',
  verifyToken,
  updateProgreso
);

router.delete(
  '/progreso-fisico/:id',
  verifyToken,
  deleteProgreso
);

/* ==========================================
   CLIENTE
========================================== */

router.get(
  '/mi-progreso',
  verifyToken,
  getMiProgreso
);

export default router;