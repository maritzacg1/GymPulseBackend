import { Router } from 'express';

import { verifyToken } from '../jwt/verifyToken.js';

import { preguntarIA } from '../controladores/iaCtrl.js';

const router = Router();

router.post('/ia', verifyToken, preguntarIA);

export default router;