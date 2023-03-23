import express from 'express'
const router = express.Router()
import { createUser, getUsers, signInUser } from '../controllers/user-controllor.js'

//Routes
router.post('/register', createUser)
router.post('/signin', signInUser)
router.get('/', getUsers)

 export default router;