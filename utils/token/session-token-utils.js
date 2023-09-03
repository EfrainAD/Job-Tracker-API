import jwt from 'jsonwebtoken'
import { throwError } from '../errorHandler/errorHandler-utils.js'

export const isTokenValid = (token) => {
   return jwt.verify(token, process.env.JWT_SECRET)
}

export const getUserIdFromToken = (token) => {
   if (!token) {
      throwError(401, 'No user token provided')
   }

   const { id } = jwt.verify(token, process.env.JWT_SECRET)
   return id
}

export const createSessionToken = (id) => {
   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' })
}
