import { Router } from 'express';
import { login, registrarCliente } from '../controladores/authCtrl.js';

const router = Router();

router.post('/login', login);
router.post('/registro', registrarCliente);

export default router;