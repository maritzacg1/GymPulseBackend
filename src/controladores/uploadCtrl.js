export const subirImagen = async (req, res) => {

  try {

    if (!req.file) {

      return res.status(400).json({

        message: 'No se recibió ninguna imagen'

      });

    }

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