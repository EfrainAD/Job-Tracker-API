# Job Application Tracker API

## What's This?
This is the API for a Job Application Tracker that is an application that helps users keep track of their job applications and outreach efforts. Coaches or mentors will have access to a user's job applications only if the user explicitly grants them access.

## Technologies Used
Node.js
Express.js
MongoDB
Mongoose

## Features
Users can track their job applications and outreach efforts.

Coaches or mentors will have access to a user's job applications only if the user explicitly grants them access.

A recruiter schema will be added to track information such as name, company, URL, email, response, and outreach method (LinkedIn, email, or both).

## Installation
To install this API, you'll need to have Node.js and MongoDB installed on your machine. Then, follow these steps:

Clone the repository from GitHub.
Navigate to the project directory.
Run npm install to install the dependencies.
Create a .env file in the root directory and add your MongoDB URI.
Run npm start to start the server.

## API Documentation (Ruft Draft)

### Users
POST /api/users/register
Registers a new user.
Parameters:
name: The user's name.
email: The user's email address.
password: The user's password.

POST /api/users/login
Logs in a user.
Parameters:
email: The user's email address.
password: The user's password.

### Jobs
POST /api/jobs
Adds a new job application.
Parameters:
companyName: The name of the company.
companySize: The size of the company.
jobTitle: The job title.
jobURL: The URL of the job posting.
jobSource: The source of the job posting.
remote: Whether the job is remote or not.
hybridLocation: The location of the hybrid job.
jobalyticsRating: The jobalytics rating for the job.
requiredExperience: The required experience for the job.
resume: The resume used for the application.
coverLetter: The cover letter used for the application.
recruiter: The ID of the recruiter associated with the job.
dateApplied: The date the application was submitted.
rejectionDate: The date the application was rejected.
rejectionReason: The reason for the rejection.
firstInterviewDate: The date of the first interview.
technicalChallengeInterviewDate: The date of the technical challenge interview.
secondInterviewDate: The date of the second interview.

GET /api/jobs
Returns a list of all job applications.

GET /api/jobs/:id
Returns a single job application.
Parameters:
id: The ID of the job application.

PUT /api/jobs/:id
Updates a job application.
Parameters:
id: The ID of the job application.
Any of the parameters listed in the POST /api/jobs endpoint.

DELETE /api/jobs/:id
Deletes a job application.
Parameters:
id: The ID of the job application.

### Recruiters
POST /api/recruiters
Adds a new recruiter.
Parameters:
name: The name of the recruiter.
company: The company the recruiter works for.
url: The URL of the recruiter's linkedin.
email: The recruiter's email.
response: Whether the recruiter has responded to the user.
outreachMethod: The method used to reach out to the recruiter, connect request or email, or both.

GET /api/recruiters
Returns a list of all recruiters the user has.

GET /api/recruiters/:id
Returns a single recruiter.
Parameters:
id: The ID of the recruiter.

PUT /api/recruiters/:id
Updates a recruiter.
Parameters:
id: The ID of the recruiter.