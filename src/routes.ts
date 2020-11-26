import { Router } from 'express'
import multer from 'multer'

import UserController from '@controllers/UserController'
import OrphanagesController from '@controllers/OrphanagesController'

import uploadConfig from '@config/upload'

const routes = Router()
const upload = multer(uploadConfig)

// Create Users
routes.post('/users', UserController.create)

routes.post('/users/authenticate', UserController.authenticate)
routes.post('/users/forget_password', UserController.forgetPassword)
routes.get('/users/forget_password/verify/:token', UserController.verifyForgetPasswordToken)
routes.post('/users/forget_password/:token', UserController.resetPassword)

// Orphanage Create
routes.post('/orphanages', upload.array('images'), OrphanagesController.create)

// Orphanage List
routes.get('/orphanages', OrphanagesController.index)

export default routes
