import express from 'express'
import {
   createCompany,
   deleteCompany,
   getALLCompanies,
   getCompany,
   getCompanies,
   updateCompany,
   getCompanyNames,
} from '../controllers/company-controllor.js'
import requireUserAuth from '../middleware/auth-middleware.js'
const router = express.Router()

// Development, needs be removed
router.get('/dev', getALLCompanies)

//Routes
router.post('/', requireUserAuth, createCompany)
router.get('/', requireUserAuth, getCompanies)
router.get('/names', requireUserAuth, getCompanyNames)
router.get('/:id', requireUserAuth, getCompany)
router.patch('/:id', requireUserAuth, updateCompany)
router.delete('/:id', requireUserAuth, deleteCompany)

export default router
