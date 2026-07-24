import { Router } from 'express';
import upload from '../middlewares/upload.js';

import {
  subirImagen,
  subirVideo
} from '../controladores/uploadCtrl.js';

import { verifyToken } from '../jwt/verifyToken.js';

const router = Router();

/* ===============================
   Subir imagen (general)
================================ */

router.post(

  '/upload',

  verifyToken,

  upload.single('imagen'),

  subirImagen

);

/* ===============================
   Subir imagen de dieta
================================ */

router.post(

  '/upload/dieta',

  verifyToken,

  upload.single('imagen'),

  subirImagen

);

/* ===============================
   Subir video
================================ */

router.post(

  '/upload/video',

  verifyToken,

  upload.single('video'),

  subirVideo

);

export default router;