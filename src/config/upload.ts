import multer from 'multer'
import path from 'path'

export default {
  dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'))
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const fileName = `${uniqueSuffix}-${file.originalname}`
      cb(null, fileName)
    }
  }),
  limits: {
    fileSize: 2 * 1024 * 1024
  }
}
