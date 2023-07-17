import Token from '../../models/token-model.js'
import User from '../../models/user-model.js'
import jwt from 'jsonwebtoken'
const EXPIRES_IN_MINUTES = process.env.EXPIRES_IN_MINUTES

export const createToken = (id) => {
   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' })
}

export const clearPasswordResetToken = async (userId) =>
   await Token.findOneAndDelete({ owner: userId })

export const savePasswordResetToken = async (
   userId,
   hashedToken,
   expiresInMernuts = EXPIRES_IN_MINUTES
) =>
   await Token.create({
      owner: userId,
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
   const user = await User.findOne({ _id: userToken.owner })
   if (!user) throw new Error('Error when retreaving user')

   return user
}
export const createPasswordResetToken = async (userId) =>
   crypto.randomBytes(32).toString('hex') + userId
export const createHashedToken = (token) =>
   crypto.createHash('sha256').update(token).digest('hex')

export const getUserIdFromToken = (token) => {
   if (!token) {
      throwError(401, 'No user token provided')
   }

   const { id } = jwt.verify(token, process.env.JWT_SECRET)
   return id
}
