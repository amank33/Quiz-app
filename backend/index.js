import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import AuthRoute from './routes/auth.route.js'
import ExamRoute from './routes/exam.route.js'
import AdminRoute from './routes/admin.route.js'
import AnalyticsRoute from './routes/analytics.route.js'

import cors from 'cors'
dotenv.config()
const app = express()


app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
// app.use(cors())

app.use(cors({
    origin: 'https://quiz-app-mern-stack-flame.vercel.app/',
    credentials: true
}))
const port = process.env.PORT
app.listen(port, () => {
    console.log('Our server is running on port:', port)
})


// database connection 

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Database connected')
}).catch(err => console.log('connection failed', err))


// router 

app.use('/api/auth', AuthRoute)
app.use('/api/exam', ExamRoute)
app.use('/api/admin', AdminRoute)
app.use('/api/analytics', AnalyticsRoute)
