import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({

  destination(req, file, cb) {

    cb(null, 'src/uploads');

  },

  filename(req, file, cb) {

    const uniqueName =

      Date.now() +

      '-' +

      Math.round(Math.random() * 1e9) +

      path.extname(file.originalname);

    cb(null, uniqueName);

  }

});

const fileFilter = (req, file, cb) => {

  if (

    file.mimetype.startsWith('image/') ||

    file.mimetype.startsWith('video/')

  ) {

    cb(null, true);

  } else {

    cb(new Error('Solo se permiten imágenes y videos'));

  }

};

const upload = multer({

  storage,

  fileFilter,

  limits: {

    fileSize: 100 * 1024 * 1024 // 100 MB

  }

});

export default upload;