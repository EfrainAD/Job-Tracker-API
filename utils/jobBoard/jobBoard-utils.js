export const isCreateJobBoardFormValidated = (formData) => {
   const { name, searchUrl } = formData

   if (!name || !searchUrl) return false

   return true
}
