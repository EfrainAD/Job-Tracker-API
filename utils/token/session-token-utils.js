import jwt from 'jsonwebtoken'

export const getUserIdFromToken = (token) => {
   if (!token) {
      throwError(401, 'No user token provided')
   }

   const { id } = jwt.verify(token, process.env.JWT_SECRET)
   return id
}

export const createToken = (id) => {
   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' })
}