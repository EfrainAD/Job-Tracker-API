import express from 'express'
import { createJob, getJobs } from '../controllers/job-controllor.js';
const router = express.Router()

//Routes
router.post('/', createJob)
router.get('/', getJobs)

 export default router;