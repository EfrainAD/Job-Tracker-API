import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import Token from '../../models/token-model.js'
import User from '../../models/user-model.js'
import { throwError } from '../errorHandler/errorHandler-utils.js'
import {
   MAX_PASSWORD_LENGTH,
   MIN_PASSWORD_LENGTH,
} from '../variables/globalVariables.js'
const EXPIRES_IN_MINUTES = process.env.EXPIRES_IN_MINUTES

export const createToken = (id) => {
   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' })
}
export const clearPasswordResetToken = async (userId) =>
   await Token.findOneAndDelete({ userId: userId })
export const savePasswordResetToken = async (
   userId,
   hashedToken,
   expiresInMernuts = EXPIRES_IN_MINUTES
) =>
   await Token.create({
      userId: userId,
      token: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + expiresInMernuts * (60 * 1000), // convert minutes to milliseconds
   })
export const getUserFromHashedResetToken = async (hashedToken) => {
   const userToken = await Token.findOne({
      token: hashedToken,
      expiresAt: { $gt: Date.now() },
   })
   if (!userToken) throw new Error('Token not found, or expired')

   // Get User from Token's owner
   const user = await User.findOne({ _id: userToken.userId })
   if (!user) throw new Error('Error when retreaving user')

   return user
}
export const createPasswordResetToken = async (userId) =>
   crypto.randomBytes(32).toString('hex') + userId
export const createHashedToken = (token) =>
   crypto.createHash('sha256').update(token).digest('hex')

export const isRegistorFormValidated = (formData) => {
   const { email, password, name } = formData

   if (!email || !password || !name) return false

   return true
}
export const isSignInFormValidated = (email, password) => {
   if (!email || !password) {
      return false
   }
   return true
}
export const isChangePasswordFormFilled = (old_password, new_password) => {
   if (!old_password || !new_password) {
      return false
   }
   return true
}
export const isPasswordTooShort = (password) =>
   password.length < MIN_PASSWORD_LENGTH

export const isPasswordTooLong = (password) =>
   password.length >= MAX_PASSWORD_LENGTH

export const checkIfUserExists = (user) => {
   if (!user) {
      return false
   }
   return true
}

const checkUserPassword = async (user, password) =>
   await bcrypt.compare(password, user.password)

export const getUserIdFromToken = (token) => {
   if (!token) {
      throwError(401, 'No user token provided')
   }

   const { id } = jwt.verify(token, process.env.JWT_SECRET)
   return id
}
export const isPasswordCorrect = async (user, password) =>
   await checkUserPassword(user, password)

export const createNewUserObj = (user, formData) => {
   const newUserObj = {}

   newUserObj.name = formData.name || user.name
   newUserObj.photo = formData.photo || user.photo
   newUserObj.phone = formData.phone || user.phone
   newUserObj.bio = formData.bio || user.bio

   return newUserObj
}
