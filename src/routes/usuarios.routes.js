import { Router } from 'express';

import {
  getUsuarios,
  getClientes,
  getUsuarioById,
  getPerfil,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  actualizarFoto
} from '../controladores/usuariosCtrl.js';

import { verifyToken } from '../jwt/verifyToken.js';

const router = Router();

router.get('/usuarios', verifyToken, getUsuarios);

router.get('/clientes', verifyToken, getClientes);

// ESTA RUTA ES LA QUE NECESITA EL PERFIL
router.get('/usuarios/:id', verifyToken, getUsuarioById);

router.get('/perfil', verifyToken, getPerfil);

router.post('/usuarios', verifyToken, createUsuario);

router.put('/usuarios/:id', verifyToken, updateUsuario);
router.put('/usuarios/foto/:id', verifyToken, actualizarFoto);

router.put('/usuarios/:id', verifyToken, updateUsuario);

export default router;