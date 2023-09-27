import Company from '../models/company-model.js'
import asyncHandler from 'express-async-handler'
import { throwError } from '../utils/errorHandler/errorHandler-utils.js'
import { isCreateCompanyAttributesValidated } from '../utils/company/company-utils.js'
import recruiterModel from '../models/recruiter-model.js'

// Create Company Function
export const createCompanyfunc = asyncHandler(async (userId, body) => {
   if (!isCreateCompanyAttributesValidated(body))
      throwError(400, 'Missing one or more required fields')

   const newCompany = { owner: userId, ...body }

   return await Company.create(newCompany)
})

// Create Company Route
export const createCompany = asyncHandler(async (req, res, next) => {
   const userId = req.user._id
   const body = req.body

   const company = await createCompanyfunc(userId, body)

   res.status(201).json(company)
})

// Get All User's Companies
export const getCompanies = asyncHandler(async (req, res) => {
   const userId = req.user._id

   const companies = await Company.find({ owner: userId })

   res.status(200).json(companies)
})

// Get All User's Companies names
export const getCompanyNames = asyncHandler(async (req, res) => {
   const userId = req.user._id

   const companies = await Company.find({ owner: userId }).select('companyName')

   res.status(200).json(companies)
})

// Get A Company
export const getCompany = asyncHandler(async (req, res) => {
   const userId = req.user._id
   const companyId = req.params.id

   const company = await Company.findOne({
      owner: userId,
      _id: companyId,
   })

   if (!company) {
      throwError(
         404,
         'Company not found, company does not exist or user does not have access.'
      )
   }

   res.status(200).json(company)
})

// TODo refactored logic out to make a func
// Create Company Function
export const updateCompanyFunc = asyncHandler(
   async (userId, companyId, body) => {
      const updatedBody = { owner: userId, ...body }

      const updatedCompany = await Company.findOneAndUpdate(
         { _id: companyId, owner: userId },
         updatedBody,
         { new: true, runValidators: true }
      )

      if (!updatedCompany) {
         throwError(
            404,
            'Company not found, company does not exist or user does not have access.'
         )
      }
      return updatedCompany
   }
)
// Update Company - PATCH
export const updateCompany = asyncHandler(async (req, res) => {
   const userId = req.user._id
   const companyId = req.params.id
   const body = req.body

   const updatedCompany = await updateCompanyFunc(userId, companyId, body)

   res.status(200).json(updatedCompany)
})

// TODo refactored logic out to make a func
// DELETE - Company
export const deleteCompany = asyncHandler(async (req, res) => {
   const userId = req.user._id
   const companyId = req.params.id

   const company = await Company.findOneAndDelete({
      owner: userId,
      _id: companyId,
   })

   if (!company)
      throwError(
         404,
         'Company not found, it does not exist or user does not have access.'
      )

   res.status(204).send()
})

// Get All Companies REMOVED AT END OF PROJECT
export const getALLCompanies = asyncHandler(async (req, res) => {
   const company = await Company.find({}).populate({
      path: 'owner',
      select: 'name email',
   })

   res.status(201).json(company)
})
