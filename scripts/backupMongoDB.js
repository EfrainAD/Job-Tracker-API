import { exec } from 'child_process'

export const createBackup = (databaseName = 'Job-Tracker') => {
   const today = new Date(Date.now())
   const todayDate = today.toISOString().slice(0, 10)
   const backupFolder = `./scripts/backup/${todayDate}`

   console.log('Starting to backup the DB')
   // Create a backup
   exec(
      `mongodump --db ${databaseName} --out ${backupFolder}`,
      (error, stdout, stderr) => {
         if (error) {
            throw new Error('Error creating backup:', error)
         } else {
            console.log('Backup completed successfully:', stdout)
         }
      }
   )
}

export const restoreBackup = (filePath, databaseName = 'Job-Tracker') => {
   console.log('Starting to restore the DB from a backup')

   exec(
      `mongorestore --db ${databaseName} ${filePath}`,
      (error, stdout, stderr) => {
         if (error) {
            throw new Error('Error restoring backup:', error)
         } else {
            console.log('Restored Backup successfully:', stdout)
         }
      }
   )
}
