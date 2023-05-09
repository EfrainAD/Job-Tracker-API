export const isCreateRecruiterFormValidated = (formData) => {
   const { name, company } = formData
   if (!name || !company) return false
   return true
}
