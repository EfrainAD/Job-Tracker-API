import express from 'express'
import {
   createJob,
   deleteJob,
   getALLJobs,
   getJob,
   getJobs,
   updateJob,
} from '../controllers/job-controllor.js'
import requireUserAuth from '../middleware/auth-middleware.js'
const router = express.Router()

// Development, needs be removed
router.get('/dev', getALLJobs)

//Routes
router.post('/', requireUserAuth, createJob)
router.get('/', requireUserAuth, getJobs)
router.get('/coachee/:id', requireUserAuth, getJobs)
router.get('/:id', requireUserAuth, getJob)
router.patch('/:id', requireUserAuth, updateJob)
router.delete('/:id', requireUserAuth, deleteJob)

export default router
