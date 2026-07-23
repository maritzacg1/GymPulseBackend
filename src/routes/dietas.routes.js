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

router.get(

  '/dietas',

  verifyToken,

  getDietas

);

router.get(

  '/dietas/:id',

  verifyToken,

  getDietaById

);

router.post(

  '/dietas',

  verifyToken,

  createDieta

);

router.put(

  '/dietas/:id',

  verifyToken,

  updateDieta

);

router.delete(

  '/dietas/:id',

  verifyToken,

  deleteDieta

);

/* ==========================================
   ASIGNACIÓN DE DIETAS
========================================== */

router.post(

  '/dietas/asignar',

  verifyToken,

  asignarDietaUsuario

);

router.get(

  '/dietas/usuario/:id',

  verifyToken,

  getDietasUsuario

);

/* ==========================================
   CLIENTE
========================================== */

router.get(

  '/mi-dieta',

  verifyToken,

  getMiDieta

);

export default router;