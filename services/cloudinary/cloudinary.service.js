import { v2 as cloudinary } from 'cloudinary'
import { throwError } from '../../utils/errorHandler/errorHandler-utils.js'
const folder = 'Job Tracker App'

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
         folder,
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

export const signImgCredentials = (public_id, folder) => {
   console.log('folder', folder)
   const timestamp = Math.round(new Date().getTime() / 1000)
   const apiSecret = cloudinary.config().api_secret
   const api_key = cloudinary.config().api_key
   if (!public_id) throwError(400, 'Public ID missing for signature')

   const signature = cloudinary.utils.api_sign_request(
      {
         timestamp,
         folder,
         public_id,
      },
      apiSecret
   )

   return { timestamp, signature, api_key }
}
