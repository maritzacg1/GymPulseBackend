import express from 'express';
import multer from 'multer';

import cloudinary from '../config/cloudinary.js';

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024
  },

  fileFilter: (req, file, callback) => {

    const tiposPermitidos = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ];

    if (!tiposPermitidos.includes(file.mimetype)) {

      return callback(
        new Error(
          'Solo se permiten imágenes JPG, PNG o WEBP'
        )
      );

    }

    callback(null, true);

  }
});


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

      const resultado = await new Promise(
        (resolve, reject) => {

          const stream =
            cloudinary.uploader.upload_stream(
              {
                folder: 'gympulse',
                resource_type: 'image'
              },
              (error, resultadoCloudinary) => {

                if (error) {

                  reject(error);

                } else {

                  resolve(resultadoCloudinary);

                }

              }
            );

          stream.end(req.file.buffer);

        }
      );

      return res.status(201).json({
        message: 'Imagen subida correctamente',

        archivo: resultado.public_id,

        ruta: resultado.secure_url,

        url: resultado.secure_url,

        public_id: resultado.public_id
      });

    } catch (error) {

      console.error(
        'Error al subir imagen:',
        error
      );

      return res.status(500).json({
        message: 'Error al subir la imagen',
        error: error.message
      });

    }

  }
);

export default router;