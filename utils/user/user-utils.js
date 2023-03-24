import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'

export const createToken = (id) => {
   return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '1d'})
}

export const validateRegistorFields = (formData, res) => {
   const {email, password, name} = formData

   if (!email || !password || !name) {
      res.status(400)
      throw new Error('All fields are required')
   }
}
export const validateSignInFields = (email, password, res) => {
   if (!email || !password) {
      res.status(400)
      throw new Error('You need both email and passowrd')
   }
}

export const validateIfUserExists = (user, res) => {
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
export const validateIfPasswordCorrect = async (user, password, res) => {
   const isPasswordCorrect = await checkUserPassword(user, password)
   console.log('ips', isPasswordCorrect)
   if (!isPasswordCorrect) {
      res.status(401)
      throw new Error('user or password is invalid')
   }
}

export const checkIfUser = (user) => {
   if (!user) {
      throw new Error(`Server Error: Improper use of get user's info function`)
   }
}

export const getNewUserObj = (user, formData) => {
   const newUserObj = {}
   
   newUserObj.name = formData.name || user.name
   newUserObj.photo = formData.photo || user.photo
   newUserObj.phone = formData.phone || user.phone
   newUserObj.bio = formData.bio || user.bio

   return newUserObj
}