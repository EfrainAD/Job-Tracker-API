import Token from '../../models/token-model.js'
import User from '../../models/user-model.js'
import { EXPIRES_IN_MINUTES } from '../variables/globalVariables.js'

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
