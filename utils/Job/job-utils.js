import Job from '../../models/job-model.js'

export const isCreateJobFormValidated = (formData) => {
   const { companyName, company, jobTitle, dateApplied } = formData

   if ((!companyName && !company) || !jobTitle || !dateApplied) return false

   return true
}

export const createJobBody = (body) => {
   const fieldNames = Object.keys(Job.schema.obj)

   return fieldNames.reduce((acc, fieldName) => {
      if (body.hasOwnProperty(fieldName)) {
         acc[fieldName] = body[fieldName]
      }
      return acc
   }, {})
}
