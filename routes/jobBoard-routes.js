import express from 'express'
import {
   createJobBoard,
   deleteJobBoard,
   getALLJobBoards,
   getJobBoards,
   updateJobBoard,
} from '../controllers/jobBoard-controllor.js'
import requireUserAuth from '../middleware/auth-middleware.js'
const router = express.Router()

// Development, needs be removed
router.get('/dev', getALLJobBoards)

//Routes
router.post('/', requireUserAuth, createJobBoard)
router.get('/', requireUserAuth, getJobBoards)
router.patch('/:id', requireUserAuth, updateJobBoard)
router.delete('/:id', requireUserAuth, deleteJobBoard)

export default router
