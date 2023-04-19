import multer from 'multer'
import { createErrorObj } from '../utils/errorHandler/errorHandler-utils.js'

const fileFilter = (req, file, cb) => {
   const allowedFormats = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/tiff',
   ]

   if (allowedFormats.includes(file.mimetype)) {
      cb(null, true)
   } else {
      cb(createErrorObj(400, 'Invalid file format'), false)
   }
}
const storage = multer.memoryStorage()

const upload = multer({ storage, fileFilter })

export default upload
