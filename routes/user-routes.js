import express from 'express'
const router = express.Router()
import {
   contactEmail,
   createUser,
   getUser,
   getUsers,
   requestEmailVerification,
   requestPasswordReset,
   resetPassword,
   signImageUploadCredentials,
   signInStatus,
   signInUser,
   signOutUser,
   updatePassword,
   updateUser,
   updateUserPicture,
   verifyEmail,
} from '../controllers/user-controllor.js'
import requireUserAuth from '../middleware/auth-middleware.js'
import upload from '../middleware/fileUploader.js'

// User Routes
router.post('/register', createUser)
router.post('/signin', signInUser)
router.delete('/signout', signOutUser)
router.get('/isLoggedIn', signInStatus)
router.get('/getuser', requireUserAuth, getUser)

// Updating Routes
router.patch('/updateuser', requireUserAuth, updateUser)
router.post(
   '/uploadprofileimage',
   requireUserAuth,
   upload.single('image'),
   updateUserPicture
)

// Passwords Routes
router.patch('/changePassword', requireUserAuth, updatePassword)
router.post('/forgotPassword', requestPasswordReset)
router.put('/resetPassword/:resetToken', resetPassword)

// Email Routes
router.post('/requesteMailVerification', requestEmailVerification)
router.post('/contactEmail/', requireUserAuth, contactEmail)
router.put('/verifyEmail/:verificationToken', verifyEmail)

// Cloudinary Signiture Routes
router.get('/imageCredentials', requireUserAuth, signImageUploadCredentials)

// Admin Routes
router.get('/', getUsers)

export default router
