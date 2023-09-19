import express from 'express'
import requireUserAuth from '../middleware/auth-middleware.js'
import {
   addUserCouch,
   getAllCouches,
   getUserCouches,
   removeCouch,
   updateUserCouchee,
} from '../controllers/couch-controllor.js'
const router = express.Router()

// All things couch
router.post('/addUserCouch', requireUserAuth, addUserCouch)
router.delete('/:id', requireUserAuth, removeCouch)
router.post('/UpdateUserCouchee', requireUserAuth, updateUserCouchee)
router.get('/getUserCouches', requireUserAuth, getUserCouches)

// ADMIN
router.get('/', getAllCouches)

export default router
