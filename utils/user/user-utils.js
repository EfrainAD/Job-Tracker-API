import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const createToken = (id) => {
   return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '1d'})
}

export const isRegistorFormValidated = (formData) => {
   const {email, password, name} = formData

   if (!email || !password || !name) 
      return false
   
   return true
}
export const isSignInFormValidated = (email, password) => {
   if (!email || !password) {
      return false
   }
   return true
}
export const isChangePasswordFormFilled = (old_password, new_password) => {
   if (!old_password || !new_password ) {
      return false
   }
   return true
}
export const isPasswordTooShort = (password) => password.length < 8

export const isPasswordTooLong = (password) => password.length >= 23

export const checkIfUserExists = (user) => {
   if (!user) {
        return false
   }
   return true
}

const checkUserPassword = async (user, password) => await bcrypt.compare(password, user.password)

export const getUserIdFromToken = (token, res) => {
   if (!token) {
      res.status(401)
      throw new Error()
   }

   const { id } = jwt.verify(token, process.env.JWT_SECRET)
   return id
}
export const isPasswordCorrect = async (user, password) => {
   console.log('check', await checkUserPassword(user, password))
   return await checkUserPassword(user, password)
}

export const createNewUserObj = (user, formData) => {
   const newUserObj = {}
   
   newUserObj.name = formData.name || user.name
   newUserObj.photo = formData.photo || user.photo
   newUserObj.phone = formData.phone || user.phone
   newUserObj.bio = formData.bio || user.bio

   return newUserObj
}