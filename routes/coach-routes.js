import express from 'express'
import requireUserAuth from '../middleware/auth-middleware.js'
import {
   addUserCoach,
   getAllCoaches,
   getUserCoaches,
   removeCoach,
   updateUserCoachee,
} from '../controllers/coach-controllor.js'
const router = express.Router()

// All things coach
router.post('/addUserCoach', requireUserAuth, addUserCoach)
router.delete('/:id', requireUserAuth, removeCoach)
router.post('/UpdateUserCoachee', requireUserAuth, updateUserCoachee)
router.get('/getUserCoaches', requireUserAuth, getUserCoaches)

// ADMIN
router.get('/', getAllCoaches)

export default router
