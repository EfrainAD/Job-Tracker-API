import bcrypt from 'bcryptjs'
import {
   MAX_PASSWORD_LENGTH,
   MIN_PASSWORD_LENGTH,
} from '../variables/globalVariables.js'

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
