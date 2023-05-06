import express from 'express'
import { createJob, deleteJob, getJobs } from '../controllers/job-controllor.js'
import requireUserAuth from '../middleware/auth-middleware.js'
const router = express.Router()

//Routes
router.post('/', requireUserAuth, createJob)
router.get('/', getJobs)
router.delete('/:id', requireUserAuth, deleteJob)

export default router
