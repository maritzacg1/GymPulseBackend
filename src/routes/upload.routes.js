import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

/*====================================
  Multer en memoria
=====================================*/

const storage = multer.memoryStorage();

const upload = multer({

  storage,

  limits: {
    fileSize: 100 * 1024 * 1024 //100 MB
  },

  fileFilter: (req, file, callback) => {

    const tiposPermitidos = [

      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',

      'video/mp4',
      'video/webm',
      'video/quicktime'

    ];

    if (!tiposPermitidos.includes(file.mimetype)) {

      return callback(
        new Error(
          'Solo se permiten imágenes JPG, PNG, WEBP y videos MP4.'
        )
      );

    }

    callback(null, true);

  }

});


/*====================================
  SUBIR IMAGEN GENERAL
=====================================*/

router.post(
  '/upload',
  upload.single('imagen'),
  async (req, res) => {

    try {

      if (!req.file) {

        return res.status(400).json({
          message: 'Debe seleccionar una imagen'
        });

      }

      const resultado = await new Promise((resolve, reject) => {

        const stream =
          cloudinary.uploader.upload_stream(

            {
              folder: 'gympulse',
              resource_type: 'image'
            },

            (error, result) => {

              if (error) {

                reject(error);

              } else {

                resolve(result);

              }

            }

          );

        stream.end(req.file.buffer);

      });

      return res.status(201).json({

        message: 'Imagen subida correctamente',

        archivo: resultado.public_id,

        ruta: resultado.secure_url,

        url: resultado.secure_url,

        secure_url: resultado.secure_url,

        public_id: resultado.public_id

      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({

        message: 'Error al subir la imagen',

        error: error.message

      });

    }

  }

);


/*====================================
  SUBIR IMAGEN DE DIETA
=====================================*/

router.post(
  '/upload/dieta',
  upload.single('imagen'),
  async (req, res) => {

    try {

      if (!req.file) {

        return res.status(400).json({
          message: 'Debe seleccionar una imagen'
        });

      }

      const resultado = await new Promise((resolve, reject) => {

        const stream =
          cloudinary.uploader.upload_stream(

            {
              folder: 'gympulse/dietas',
              resource_type: 'image'
            },

            (error, result) => {

              if (error) {

                reject(error);

              } else {

                resolve(result);

              }

            }

          );

        stream.end(req.file.buffer);

      });

      return res.status(201).json({

        message: 'Imagen de dieta subida correctamente',

        archivo: resultado.public_id,

        ruta: resultado.secure_url,

        url: resultado.secure_url,

        secure_url: resultado.secure_url,

        public_id: resultado.public_id

      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({

        message: 'Error al subir la imagen',

        error: error.message

      });

    }

  }

);


/*====================================
  SUBIR VIDEO
=====================================*/

router.post(
  '/upload/video',
  upload.single('video'),
  async (req, res) => {

    try {

      if (!req.file) {

        return res.status(400).json({
          message: 'Debe seleccionar un video'
        });

      }

      const resultado = await new Promise((resolve, reject) => {

        const stream =
          cloudinary.uploader.upload_stream(

            {
              folder: 'gympulse/videos',
              resource_type: 'video'
            },

            (error, result) => {

              if (error) {

                reject(error);

              } else {

                resolve(result);

              }

            }

          );

        stream.end(req.file.buffer);

      });

      return res.status(201).json({

        message: 'Video subido correctamente',

        archivo: resultado.public_id,

        ruta: resultado.secure_url,

        url: resultado.secure_url,

        secure_url: resultado.secure_url,

        public_id: resultado.public_id

      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({

        message: 'Error al subir el video',

        error: error.message

      });

    }

  }

);

export default router;