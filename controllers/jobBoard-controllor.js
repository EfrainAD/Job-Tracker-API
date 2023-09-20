import JobBoard from '../models/jobBoard-model.js'
import asyncHandler from 'express-async-handler'
import { throwError } from '../utils/errorHandler/errorHandler-utils.js'
import { isCreateJobBoardFormValidated } from '../utils/JobBoard/jobBoard-utils.js'

// Create JobBoard
export const createJobBoard = asyncHandler(async (req, res, next) => {
   const userId = req.user._id
   const body = req.body

   if (!isCreateJobBoardFormValidated(body))
      throwError(400, 'Missing one or more required fields')

   const newJobBoard = { ...body, owner: userId }

   const jobBoard = await JobBoard.create(newJobBoard)

   res.status(201).json(jobBoard)
})

// Get All User's JobBoards
export const getJobBoards = asyncHandler(async (req, res) => {
   const userId = req.user._id

   const jobBoards = await JobBoard.find({ owner: userId })
      // .select(
      //    'companyName jobBoardTitle remote recruiter dateApplied rejectionDate firstInterviewDate technicalChallengeInterviewDate secondInterviewDate'
      // )
      .sort({ name: 1 })

   res.status(200).json(jobBoards)
})

// Update JobBoard - PATCH
export const updateJobBoard = asyncHandler(async (req, res) => {
   const userId = req.user._id
   const jobBoardId = req.params.id
   const body = req.body

   const updatedBody = { ...body, owner: userId }

   const updatedJobBoard = await JobBoard.findOneAndUpdate(
      { _id: jobBoardId, owner: userId },
      updatedBody,
      { new: true, runValidators: true }
   )

   if (!updatedJobBoard) {
      throwError(
         404,
         'JobBoard not found, jobBoard does not exist or user does not have access.'
      )
   }

   res.status(200).json(updatedJobBoard)
})

// DELETE - JobBoard
export const deleteJobBoard = asyncHandler(async (req, res) => {
   const userId = req.user._id
   const jobBoardId = req.params.id

   const jobBoard = await JobBoard.findOneAndDelete({
      _id: jobBoardId,
      owner: userId,
   })

   if (jobBoard === null)
      throwError(
         404,
         'JobBoard not found, it does not exist or user does not have access.'
      )

   res.status(204).send(jobBoard)
})

// Get All JobBoards
export const getALLJobBoards = asyncHandler(async (req, res) => {
   const jobBoard = await JobBoard.find({}).populate({
      path: 'owner',
      select: 'name email',
   })
   res.status(201).json(jobBoard)
})
