import express from 'express'
import { Login, Register, sendResetPasswordEmail } from '../controllers/Authcontroller.js'
import { authenticate } from '../middleware/authenticate.js'

const router = express.Router()

router.post('/register', Register)
router.post('/login', Login)
router.get('/get-user', authenticate, (req, res) => {
    res.status(200).json({ status: true, user: req.user })
})

router.get('/forgot-password-email/:email',sendResetPasswordEmail )

export default router