import mongoose from 'mongoose'
import Job from '../models/job-model.js'
import Company from '../models/company-model.js'

const MONGO_DB = 'mongodb://localhost:27017/Job-Tracker'

// Related to backup'
import { exec } from 'child_process'
const databaseName = 'Job-Tracker'
const backupFolder = `./scripts/backup/${Date.now()}`

// Create a backup
exec(
   `mongodump --db ${databaseName} --out ${backupFolder}`,
   (error, stdout, stderr) => {
      if (error) {
         console.error('Error creating backup:', error)
      } else {
         console.log('Backup completed successfully:', stdout)
         runMigration()
      }
   }
)

const runMigration = async () => {
   try {
      console.log(
         'Make sure if you have not to add companyName and companySize to the schema to work. Remove it after that.'
      )
      await mongoose.connect(MONGO_DB)
      const banner = '/'.repeat(20)

      // Get all the old DB data that used the old schema (companyName was required)
      const allJobs = await Job.find({ companyName: { $exists: true } })

      // parse out the info that going to be moved to another Collection
      console.log(banner, 'Parsing out the company info', banner)
      const companies = []

      allJobs.forEach((job) => {
         // Find if company has already been added
         const find = companies.find((company) => {
            company.companyName === job.companyName
         })

         // if you do have the company already, add the company size if it doesn's all ready have a value
         if (find && !find.companySize && job.companySize) {
            find.companySize = job.companySize
         }

         // Add the company with or without the size if none already exists
         if (!find) {
            const company = {}

            company.companyName = job.companyName
            company.owner = job.owner
            if (job.companySize) {
               company.companySize = job.companySize
            }

            companies.push(company)
         }
      })

      // Now you have all your companies to add to the DB Company Collection
      // console.log(companies)

      // Add/Create the Company documenets to the collection
      console.log(banner, 'Creating the companies', banner)
      const addedCompanies = await Company.create(companies)

      // console.log(addedCompanies)
      console.log(banner, 'Adding the new companies doc to the jobs', banner)

      // update all the jobs to add the companies
      for (const job of allJobs) {
         const find = addedCompanies.find((company) => {
            return company.companyName === job.companyName
         })
         await Job.findByIdAndUpdate(job._id, { company: find._id })
      }

      console.log(
         banner,
         'Removing the companyName and companySize field',
         banner
      )
      // clear out the companyName and companySize
      await Job.updateMany({}, { $unset: { companyName: 1, companySize: 1 } })
   } catch (error) {
      console.error('Error in migrating users:', error)
   } finally {
      const Jobs1 = await Job.find({ companyName: { $exists: true } })
      const Jobs2 = await Job.find({ companySize: { $exists: true } })

      if (Jobs1 < 1 && Jobs2 < 1) console.log('Migragetion successful')
      else console.log(`No error's but something went wrong`)
      mongoose.connection.close()
   }
}
