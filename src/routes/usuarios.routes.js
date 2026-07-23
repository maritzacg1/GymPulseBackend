import { Router } from 'express';
import { verifyToken } from '../jwt/verifyToken.js';

import {
  getUsuarios,
  getUsuarioById,
  getPerfil,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  actualizarFoto,
   getClientes,
} from '../controladores/usuariosCtrl.js';

const router = Router();


router.get('/usuarios', verifyToken, getUsuarios);

router.get('/perfil', verifyToken, getPerfil);

router.get('/usuarios/:id', getUsuarioById);

router.post('/usuarios', createUsuario);
router.get('/clientes', verifyToken, getClientes);

// Primero FOTO
router.put(
  '/usuarios/foto/:id',
  verifyToken,
  actualizarFoto
);


// Después UPDATE general
router.put(
  '/usuarios/:id',
  updateUsuario
);


router.delete(
  '/usuarios/:id',
  deleteUsuario
);


export default router;