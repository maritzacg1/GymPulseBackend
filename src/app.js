import dotenv from 'dotenv';

dotenv.config();
import express from 'express';
import cors from 'cors';
import usuariosRoutes from './routes/usuarios.routes.js';
import authRoutes from './routes/auth.routes.js';
import membresiasRoutes from './routes/membresias.routes.js';
import ejerciciosRoutes from './routes/ejercicios.routes.js';
import rutinasRoutes from './routes/rutinas.routes.js';
import pagosRoutes from './routes/pagos.routes.js';
import asistenciasRoutes from './routes/asistencias.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import progresoRoutes from './routes/progreso.routes.js';
import dietasRoutes from './routes/dietas.routes.js';
import notificacionesRoutes from './routes/notificaciones.routes.js';
import entrenadoresRoutes from './routes/entrenadores.routes.js';
import reportesRoutes from './routes/reportes.routes.js';
import iaRoutes from './routes/ia.routes.js';
import historialRoutes from './routes/historial.routes.js';
import uploadRoutes from './routes/upload.routes.js';

const app = express();

app.use(cors({
  origin: [
    'http://localhost:8100',
    'http://127.0.0.1:8100'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'API GymPulse AI funcionando correctamente'
  });
});

app.use('/api', usuariosRoutes);
app.use('/api', authRoutes);
app.use('/api', membresiasRoutes);
app.use('/api', ejerciciosRoutes);
app.use('/api', rutinasRoutes);
app.use('/api', pagosRoutes);
app.use('/api', asistenciasRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', progresoRoutes);
app.use('/api', dietasRoutes);
app.use('/api', notificacionesRoutes);
app.use('/api', entrenadoresRoutes);
app.use('/api', reportesRoutes);
app.use('/api', iaRoutes);
app.use('/api', historialRoutes);
app.use('/api', uploadRoutes);
app.use('/uploads', express.static('src/uploads'));

export default app;