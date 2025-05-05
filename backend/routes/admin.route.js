import express from 'express'
import AdminController from '../controllers/Admincontroller.js'

const router = express.Router()

// Fetch all users (admins and regular users)
router.get('/users', AdminController.getAllUsers)
router.get('/assignQuiz', AdminController.assignUserstoQuiz)
router.post('/assignQuiz', AdminController.assignUserstoQuiz)
router.get('/assignedStudents', AdminController.getAssignedStudents);

router.post('/assignQuiztoStudent', AdminController.assignQuiztoStudent)
router.post('/unassignQuizfromStudent', AdminController.unassignQuizfromStudent)

// Route to delete a user
router.delete('/users/:id', AdminController.deleteUser);

// Route to update a user
router.put('/users/:id', AdminController.updateUser);

export default router