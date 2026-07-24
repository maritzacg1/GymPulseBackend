import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import usuariosRoutes from './routes/usuarios.routes.js';
import authRoutes from './routes/auth.routes.js';
import membresiasRoutes from './routes/membresias.routes.js';
import ejerciciosRoutes from './routes/ejercicios.routes.js';
import rutinasRoutes from './routes/rutinas.routes.js';
import pagosRoutes from './routes/pagos.routes.js';
import asistenciasRoutes from './routes/asistencias.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import dietasRoutes from './routes/dietas.routes.js';
import notificacionesRoutes from './routes/notificaciones.routes.js';
import entrenadoresRoutes from './routes/entrenadores.routes.js';
import reportesRoutes from './routes/reportes.routes.js';
import iaRoutes from './routes/ia.routes.js';
import historialRoutes from './routes/historial.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import progresoRoutes from './routes/progreso.routes.js';

const app = express();

/* ==========================================
   Ruta absoluta de la carpeta src
========================================== */

const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);

/* ==========================================
   CORS
========================================== */

app.use(
  cors({
    origin: [
      'http://localhost:8100',
      'http://127.0.0.1:8100',
      'https://localhost',
      'capacitor://localhost'
    ],

    credentials: true,

    methods: [
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'OPTIONS'
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization'
    ]
  })
);

app.options(
  '*',
  cors()
);

/* ==========================================
   Lectura del Body
========================================== */

app.use(
  express.json({
    limit: '15mb'
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '15mb'
  })
);

/* ==========================================
   Carpeta de imágenes
========================================== */

app.use(
  '/uploads',
  express.static(
    path.join(
      __dirname,
      'uploads'
    )
  )
);

/* ==========================================
   Ruta principal
========================================== */

app.get(
  '/',
  (req, res) => {

    return res.json({
      message:
        'API GymPulse AI funcionando correctamente'
    });

  }
);

/* ==========================================
   API
========================================== */

app.use(
  '/api',
  usuariosRoutes
);

app.use(
  '/api',
  authRoutes
);

app.use(
  '/api',
  membresiasRoutes
);

app.use(
  '/api',
  ejerciciosRoutes
);

app.use(
  '/api',
  rutinasRoutes
);

app.use(
  '/api',
  pagosRoutes
);

app.use(
  '/api',
  asistenciasRoutes
);

app.use(
  '/api',
  dashboardRoutes
);

app.use(
  '/api',
  dietasRoutes
);

app.use(
  '/api',
  notificacionesRoutes
);

app.use(
  '/api',
  entrenadoresRoutes
);

app.use(
  '/api',
  reportesRoutes
);

app.use(
  '/api',
  iaRoutes
);

app.use(
  '/api',
  historialRoutes
);

app.use(
  '/api',
  uploadRoutes
);

app.use(
  '/api',
  progresoRoutes
);

/* ==========================================
   Ruta no encontrada
========================================== */

app.use(
  (req, res) => {

    return res.status(404).json({
      message:
        `Ruta no encontrada: ${req.method} ${req.originalUrl}`
    });

  }
);

/* ==========================================
   Manejo general de errores
========================================== */

app.use(
  (error, req, res, next) => {

    console.error(
      'Error general del servidor:',
      error
    );

    return res.status(
      error.status || 500
    ).json({
      message:
        error.message ||
        'Error interno del servidor'
    });

  }
);

export default app;