import { guardarHistorial } from './historialCtrl.js';

export const subirImagen = async (req, res) => {

  try {

    if (!req.file) {

      return res.status(400).json({

        message: 'No se recibió ninguna imagen'

      });

    }

    await guardarHistorial(

      req.usuario?.id_usuario || 0,

      'UPLOADS',

      'SUBIR_IMAGEN',

      `Subió la imagen ${req.file.filename}`

    );

    res.json({

      message: 'Imagen subida correctamente',

      archivo: req.file.filename,

      ruta: `/uploads/${req.file.filename}`

    });

  } catch (error) {

    res.status(500).json({

      message: 'Error al subir imagen',

      error: error.message

    });

  }

};

export const subirVideo = async (req, res) => {

  try {

    if (!req.file) {

      return res.status(400).json({

        message: 'No se recibió ningún video'

      });

    }

    await guardarHistorial(

      req.usuario?.id_usuario || 0,

      'UPLOADS',

      'SUBIR_VIDEO',

      `Subió el video ${req.file.filename}`

    );

    res.json({

      message: 'Video subido correctamente',

      archivo: req.file.filename,

      ruta: `/uploads/${req.file.filename}`

    });

  } catch (error) {

    res.status(500).json({

      message: 'Error al subir video',

      error: error.message

    });

  }

};