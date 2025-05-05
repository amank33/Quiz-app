import express from 'express'
import ExamController from '../controllers/Examcontroller.js'

const router = express.Router()

router.post('/createNew', ExamController.createNewExam)
router.post('/update/:id', ExamController.updateExam)
router.get('/getAllExams', ExamController.getAllExams)
router.get('/getExamById/:id', ExamController.getExamById)
router.delete('/deleteExam/:id', ExamController.deleteExam)

//from student submit
router.post('/submitQuiz', ExamController.submitQuiz);

export default router