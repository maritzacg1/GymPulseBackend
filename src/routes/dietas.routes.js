import { Router } from 'express';

import {

  getDietas,
  getDietaById,
  createDieta,
  updateDieta,
  deleteDieta,
  asignarDietaUsuario,
  getDietasUsuario,
  getMiDieta

} from '../controladores/dietasCtrl.js';

import { verifyToken } from '../jwt/verifyToken.js';

const router = Router();

/* ==========================================
   CRUD DIETAS
========================================== */

// Listar dietas
router.get(
  '/dietas',
  verifyToken,
  getDietas
);

// Buscar dieta
router.get(
  '/dietas/:id',
  verifyToken,
  getDietaById
);

// Crear dieta
router.post(
  '/dietas',
  verifyToken,
  createDieta
);

// Actualizar dieta
router.put(
  '/dietas/:id',
  verifyToken,
  updateDieta
);

// Eliminar dieta
router.delete(
  '/dietas/:id',
  verifyToken,
  deleteDieta
);


/* ==========================================
   ASIGNAR DIETA A CLIENTES
========================================== */

// Asignar dieta
router.post(
  '/dietas/asignar',
  verifyToken,
  asignarDietaUsuario
);

// Historial de dietas de un cliente
router.get(
  '/dietas/usuario/:id',
  verifyToken,
  getDietasUsuario
);


/* ==========================================
   CLIENTE
========================================== */

// Ver mi dieta activa
router.get(
  '/mi-dieta',
  verifyToken,
  getMiDieta
);

export default router;