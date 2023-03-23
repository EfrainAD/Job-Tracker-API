import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const createToken = (id) => {
   return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '1d'})
}

export const validateSignInFields = (email, password) => {
   if (!email || !password) {
      res.status(400)
      throw new Error('You need both email and passowrd')
   }
}

export const validateIfUserExists = (user) => {
   if (!user) {
        res.status(400)
        throw new Error('user or password is invalid')
   }
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
export const validateIfPasswordCorrect = async (user, password) => {
   const isPasswordCorrect = await checkUserPassword(user, password)
   
   if (!isPasswordCorrect) {
      res.status(400)
      throw new Error('user or password is invalid')
   }
}

export const checkIfUser = (user) => {
   if (!user) {
      throw new Error(`Server Error: Improper use of get user's info function`)
   }
}

export const getNewUserOjt = (user, formData) => {
   const newUserObj = {}
   
   newUserObj.name = formData.name || user.name
   newUserObj.photo = formData.photo || user.photo
   newUserObj.phone = formData.phone || user.phone
   newUserObj.bio = formData.bio || user.bio

   return newUserObj
}