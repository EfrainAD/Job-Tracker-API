import express from 'express'
const router = express.Router()
import {
   createUser,
   getUser,
   getUsers,
   requestEmailVerification,
   requestPasswordReset,
   resetPassword,
   signImageUploadCredentials,
   signInUser,
   signOutUser,
   updatePassword,
   updateUser,
   addUserCouch,
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
router.post('/updateusercouch', requireUserAuth, addUserCouch)
// Passwords
router.patch('/changepassword', requireUserAuth, updatePassword)
router.post('/forgotpassword', requestPasswordReset)
router.put('/resetpassword/:resetToken', resetPassword)
// email verification
router.post('/requestemailverification', requestEmailVerification)
router.put('/verifyemail/:resetToken', verifyEmail)
// Cloudinary Signiture
router.get('/imagecredentials', requireUserAuth, signImageUploadCredentials)

router.get('/', getUsers)

export default router
