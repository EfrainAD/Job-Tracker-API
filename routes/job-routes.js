import express from 'express'
import { getJobs } from '../controllers/job-controllor.js';
const router = express.Router()

//Routes
router.get('/', getJobs)

 export default router;