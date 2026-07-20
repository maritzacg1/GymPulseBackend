import { connmysql } from '../db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config.js';

export const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    const [rows] = await connmysql.query(
      `SELECT 
        u.id_usuario,
        u.id_rol,
        r.nombre AS rol,
        u.nombres,
        u.apellidos,
        u.correo,
        u.password,
        u.estado
      FROM usuarios u
      INNER JOIN roles r ON u.id_rol = r.id_rol
      WHERE u.correo = ? AND u.estado = 1`,
      [correo]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Correo no registrado' });
    }

    const usuario = rows[0];

    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        id_rol: usuario.id_rol,
        rol: usuario.rol
      },
      config.jwtSecret,
      { expiresIn: '365d' }
    );

    delete usuario.password;

    res.json({
      message: 'Login correcto',
      usuario,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en login', error: error.message });
  }
};