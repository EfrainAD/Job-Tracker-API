import { v2 as cloudinary } from 'cloudinary'
import { throwError } from '../../utils/errorHandler/errorHandler-utils.js'

const fileToDataUri = (file) => {
   const buffer = file.buffer
   const mimeType = file.mimetype

   const base64 = buffer.toString('base64')
   return `data:${mimeType};base64,${base64}`
}

export const uploadImage = async (public_id, file) => {
   try {
      const dataUri = fileToDataUri(file)

      return await cloudinary.uploader.upload(dataUri, {
         public_id,
         folder: 'Job Tracker App',
         resource_type: 'image',
         overwrite: true,
      })
   } catch (error) {
      console.log('error', error)
      throwError(
         500,
         'Something went wrong when uploading, file may be larger than 100 MB'
      )
   }
}
