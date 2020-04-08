import multer from "multer"

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if(isPhoto) {
      next(null, true);
    } else {
      next({ name: 'Wrong file', message: "That file tipe isn't allowed!"}, false)
    }
  }
})