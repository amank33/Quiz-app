import express from 'express'
import AnalyticsController from '../controllers/AnalyticsController.js'

const router = express.Router()

// Fetch all users (admins and regular users)
router.get('/user/:id', AnalyticsController.getUserAnalytics)

// Fetch top performers
router.get('/top-performers', AnalyticsController.getTopPerformers)

// Admin analytics route
router.get('/admin', AnalyticsController.getAdminAnalytics)

export default router