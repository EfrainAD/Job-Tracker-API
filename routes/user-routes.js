import express from 'express'
const router = express.Router()
import { createUser, getUsers } from '../controllers/user-controllor.js'

//Routes
router.post('/', createUser)
router.get('/', getUsers)

 export default router;