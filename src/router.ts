import { Router } from 'express'
import { SurveyController } from './controllers/SurveyController'
import { UserController } from './controllers/UserController'
import { SendMailController } from './controllers/SendMailController'
import { AnswerController } from './controllers/AnswerController'

const router = Router()

const userController = new UserController()
const surveyController = new SurveyController()
const sendMailController = new SendMailController()
const answerController = new AnswerController()

// users
router.post('/users', userController.create)

// Surveys
router.post('/surveys', surveyController.create)
router.get('/surveys', surveyController.index)

// Send Mail
router.post('/sendMail', sendMailController.execute)

// Answers
router.get('/answers', answerController.execute)

export { router }