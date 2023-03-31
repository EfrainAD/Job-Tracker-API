import express from 'express'
const router = express.Router()
import { createUser, getUser, getUsers, signInUser, signOutUser, updatePassword, updateUser } from '../controllers/user-controllor.js'
import requireUserAuth from '../middleware/auth-middleware.js'

//Routes
router.post('/register', createUser)
router.post('/signin', signInUser)
router.get('/signout', signOutUser)
router.get('/getuser', requireUserAuth, getUser)
router.patch('/updateuser', requireUserAuth, updateUser)
router.patch('/changepassword', requireUserAuth, updatePassword)

router.get('/', getUsers)

 export default router;