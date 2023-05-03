import express from 'express'
const router = express.Router()
import {
   createUser,
   getUser,
   getUsers,
   requestEmailVerification,
   requestPasswordReset,
   resetPassword,
   signInUser,
   signOutUser,
   updatePassword,
   updateUser,
   updateUserPicture,
   verifyEmail,
} from '../controllers/user-controllor.js'
import requireUserAuth from '../middleware/auth-middleware.js'
import upload from '../middleware/fileUploader.js'

//Routes
router.post('/register', createUser)
router.post('/signin', signInUser)
router.get('/signout', signOutUser)
router.get('/getuser', requireUserAuth, getUser)
// Updating
router.patch('/updateuser', requireUserAuth, updateUser)
router.post(
   '/uploadprofileimage',
   requireUserAuth,
   upload.single('image'),
   updateUserPicture
)
// Passwords
router.patch('/changepassword', requireUserAuth, updatePassword)
router.post('/forgotpassword', requestPasswordReset)
router.put('/resetpassword/:resetToken', resetPassword)
// email verification
router.post('/requestemailverification', requestEmailVerification)
router.put('/verifyemail/:resetToken', verifyEmail)

router.get('/', getUsers)

export default router
