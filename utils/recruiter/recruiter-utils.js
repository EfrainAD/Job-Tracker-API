import Recruiter from '../../models/recruiter-model.js'

export const createRecruiterBody = (body) => {
   const recuiterProperties = Object.keys(Recruiter.schema.obj)

   return recuiterProperties.reduce((acc, property) => {
      if (body.hasOwnProperty(property)) {
         acc[property] = body[property]
      }
      return acc
   }, {})
}

export const isCreateRecruiterAttributesValidated = (attributeData) => {
   const { name, company } = attributeData

   if (!name || !company) return false
   else return true
}
