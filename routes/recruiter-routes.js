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

// Dev Routes, REMOVE AFTER PROJECT
router.get('/dev', getALLRecruiters)

//Routes
router.post('/', requireUserAuth, createRecruiter)
router.get('/', requireUserAuth, getRecruiters)
router.get('/:id', requireUserAuth, getRecruiter)
router.patch('/:id', requireUserAuth, updateRecruiter)
router.delete('/:id', requireUserAuth, deleteRecruiter)

export default router
