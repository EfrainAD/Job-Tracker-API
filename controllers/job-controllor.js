import Job from "../models/job-model.js";
//TODO: handle errors
// GET
export const createJob = async (req, res) => {
   const job = await Job.create(req.body)
   res.status(201).json(job)
}
export const getJobs = async (req, res) => {
   const job = await Job.find({})
   res.status(201).json(job)
}