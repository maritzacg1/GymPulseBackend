import { Router } from 'express';

import upload from '../middlewares/upload.js';

import {

  subirImagen,
  subirVideo

} from '../controladores/uploadCtrl.js';

import { verifyToken } from '../jwt/verifyToken.js';

const router = Router();

router.post(

  '/upload',

  verifyToken,

  upload.single('imagen'),

  subirImagen

);

router.post(

  '/upload/video',

  verifyToken,

  upload.single('video'),

  subirVideo

);

export default router;