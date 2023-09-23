import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'

// Routes Import
import jobRoutes from './routes/job-routes.js'
import jobBoardRoutes from './routes/jobBoard-routes.js'
import userRoutes from './routes/user-routes.js'
import recruiterRoutes from './routes/recruiter-routes.js'
import couchRoutes from './routes/couch-routes.js'
import companyRoutes from './routes/company-routes.js'

// Middleware Imports
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import errorHandler from './middleware/errorHandler.js'

// config var
const PORT = process.env.PORT || 8000
const FRONT_END_URL = process.env.FRONT_END_URL || 'https://localhost:3000'
const MONGO_DB = process.env.MONGO_DB || 'mongodb://localhost:27017/Job-Tracker'

const app = express()

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))
app.use(
   cors({
      origin: [FRONT_END_URL, 'http://localhost:3000'],
      credentials: true,
   })
)

// Routes
app.use('/api/jobs', jobRoutes)
app.use('/api/jobBoards', jobBoardRoutes)
app.use('/api/users', userRoutes)
app.use('/api/recruiters', recruiterRoutes)
app.use('/api/couch', couchRoutes)
app.use('/api/companies', companyRoutes)

app.get('/', (req, res) => {
   res.send(
      '<div style="height:100%;display:flex;justify-content:center;align-items:center;"><h1>This API is working!</h1></div>'
   )
})

// Middleware Error
app.use(errorHandler)

mongoose
   .connect(MONGO_DB)
   .then(() => {
      app.listen(PORT, () => {
         console.log(`This server is running on port ${PORT}`)
      })
   })
   .catch((error) => console.log(error))
