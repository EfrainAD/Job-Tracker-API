import Company from '../../models/company-model.js'

export const isCreateCompanyAttributesValidated = (attributeData) => {
   const { companyName } = attributeData
   if (!companyName) return false

   return true
}

export const createCompanyBody = (body) => {
   const companyProperties = Object.keys(Company.schema.obj)

   return companyProperties.reduce((acc, property) => {
      if (body.hasOwnProperty(property)) {
         acc[property] = body[property]
      }
      return acc
   }, {})
}
