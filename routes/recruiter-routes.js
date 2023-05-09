import express from 'express'
const router = express.Router()
import requireUserAuth from '../middleware/auth-middleware.js'
import {
   createRecruiter,
   deleteRecruiter,
   getALLRecruiters,
   getRecruiter,
   getRecruiters,
   updateRecruiter,
} from '../controllers/recruiter-controllor.js'

//Routes
router.post('/', requireUserAuth, createRecruiter)

export default router
