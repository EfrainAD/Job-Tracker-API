export const isCreateCompanyAttributesValidated = (attributeData) => {
   const { name } = attributeData
   if (!name) return false

   return true
}
