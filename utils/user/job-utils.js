export const isCreateJobFormValidated = (formData) => {
  const { companyName, jobTitle, dateApplied } = formData
   if (!companyName || !jobTitle || !dateApplied) 
      return false
   
   return true
}