import { connmysql } from '../db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config.js';

/* ===========================
   LOGIN
=========================== */
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
      INNER JOIN roles r
      ON u.id_rol = r.id_rol
      WHERE u.correo = ? 
      AND u.estado = 1`,

      [correo]

    );

    if (rows.length === 0) {

      return res.status(401).json({

        message: 'Correo no registrado'

      });

    }

    const usuario = rows[0];

    const passwordValida = await bcrypt.compare(

      password,

      usuario.password

    );

    if (!passwordValida) {

      return res.status(401).json({

        message: 'Contraseña incorrecta'

      });

    }

    const token = jwt.sign(

      {

        id_usuario: usuario.id_usuario,

        id_rol: usuario.id_rol,

        rol: usuario.rol

      },

      config.jwtSecret,

      {

        expiresIn: '365d'

      }

    );

    delete usuario.password;

    res.json({

      message: 'Login correcto',

      usuario,

      token

    });

  }

  catch (error) {

    console.error(error);

    res.status(500).json({

      message: 'Error en login',

      error: error.message

    });

  }

};


/* ===========================
   REGISTRO CLIENTE
=========================== */
export const registrarCliente = async (req, res) => {

  try {

    const {

      nombres,
      apellidos,
      cedula,
      telefono,
      correo,
      password,
      fecha_nacimiento,
      genero

    } = req.body;

    /* ======================
       VALIDACIONES
    ====================== */

    if (

      !nombres ||
      !apellidos ||
      !cedula ||
      !telefono ||
      !correo ||
      !password ||
      !fecha_nacimiento ||
      !genero

    ) {

      return res.status(400).json({

        message: 'Todos los campos son obligatorios'

      });

    }

    if (!correo.includes('@')) {

      return res.status(400).json({

        message: 'Correo inválido'

      });

    }

    if (password.length < 6) {

      return res.status(400).json({

        message: 'La contraseña debe tener mínimo 6 caracteres'

      });

    }

    if (cedula.length != 10) {

      return res.status(400).json({

        message: 'La cédula debe tener 10 dígitos'

      });

    }

    /* ======================
       VALIDAR CORREO
    ====================== */

    const [existeCorreo] = await connmysql.query(

      `SELECT id_usuario
       FROM usuarios
       WHERE correo = ?`,

      [correo]

    );

    if (existeCorreo.length > 0) {

      return res.status(400).json({

        message: 'El correo ya está registrado'

      });

    }

    /* ======================
       VALIDAR CEDULA
    ====================== */

    const [existeCedula] = await connmysql.query(

      `SELECT id_usuario
       FROM usuarios
       WHERE cedula = ?`,

      [cedula]

    );

    if (existeCedula.length > 0) {

      return res.status(400).json({

        message: 'La cédula ya está registrada'

      });

    }

    /* ======================
       ENCRIPTAR PASSWORD
    ====================== */

    const passwordHash = await bcrypt.hash(

      password,

      10

    );

    /* ======================
       GENERAR QR
    ====================== */

    const qr_codigo =

      'GYM-' +

      Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()

      +

      '-' +

      Date.now();

    /* ======================
       INSERTAR CLIENTE
    ====================== */

    const [resultado] = await connmysql.query(

      `INSERT INTO usuarios(

        id_rol,
        nombres,
        apellidos,
        cedula,
        telefono,
        correo,
        password,
        fecha_nacimiento,
        genero,
        foto,
        qr_codigo,
        estado

      )

      VALUES(

        ?,?,?,?,?,?,?,?,?,?,?,?

      )`,

      [

        3, // Cliente

        nombres,

        apellidos,

        cedula,

        telefono,

        correo,

        passwordHash,

        fecha_nacimiento,

        genero,

        null,

        qr_codigo,

        1

      ]

    );

    res.status(201).json({

      message: 'Cliente registrado correctamente',

      id_usuario: resultado.insertId,

      qr_codigo

    });

  }

  catch (error) {

    console.error(error);

    res.status(500).json({

      message: 'Error al registrar cliente',

      error: error.message

    });

  }

};