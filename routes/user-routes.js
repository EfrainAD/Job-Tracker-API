import express from 'express'
const router = express.Router()
import { createUser, getUsers, signInUser, signOutUser } from '../controllers/user-controllor.js'
import requireUserAuth from '../middleware/auth-middleware.js'

//Routes
router.post('/register', createUser)
router.post('/signin', signInUser)
router.get('/signout', signOutUser)

router.get('/', getUsers)

 export default router;