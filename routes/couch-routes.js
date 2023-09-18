import express from 'express'
import requireUserAuth from '../middleware/auth-middleware.js'
import {
   addUserCouch,
   getAllCouches,
   getUserCouches,
   removeUserCouch,
   updateUserCouchee,
} from '../controllers/couch-controllor.js'
const router = express.Router()

// All things couch
router.post('/addUserCouch', requireUserAuth, addUserCouch)
router.post('/removeUserCouch', requireUserAuth, removeUserCouch)
router.post('/UpdateUserCouchee', requireUserAuth, updateUserCouchee)
router.get('/getUserCouches', requireUserAuth, getUserCouches)

// ADMIN
router.get('/', getAllCouches)

export default router
