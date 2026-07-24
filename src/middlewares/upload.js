import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
  Si este archivo está en:

  src/config/multer.js

  entonces subimos un nivel y entramos a uploads:

  src/uploads
*/
const uploadsPath = path.join(
  __dirname,
  '..',
  'uploads'
);

/*
  Crea la carpeta uploads si no existe
*/
if (!fs.existsSync(uploadsPath)) {

  fs.mkdirSync(uploadsPath, {
    recursive: true
  });

}

const storage = multer.diskStorage({

  destination(req, file, cb) {

    cb(null, uploadsPath);

  },

  filename(req, file, cb) {

    const extension =
      path.extname(file.originalname).toLowerCase();

    const nombreOriginal =
      path
        .basename(file.originalname, extension)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-');

    const nombre =
      `${nombreOriginal}-${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${extension}`;

    cb(null, nombre);

  }

});

const fileFilter = (
  req,
  file,
  cb
) => {

  const tiposPermitidos = [

    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',

    'video/mp4',
    'video/webm',
    'video/quicktime'

  ];

  if (
    tiposPermitidos.includes(
      file.mimetype
    )
  ) {

    cb(null, true);

  } else {

    cb(
      new Error(
        'Solo se permiten imágenes y videos válidos'
      ),
      false
    );

  }

};

const upload = multer({

  storage,

  fileFilter,

  limits: {

    fileSize:
      100 * 1024 * 1024

  }

});

export default upload;