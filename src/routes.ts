import { Router } from 'express'

import UserController from '@controllers/UserController'

const routes = Router()

routes.post('/users', UserController.create)

routes.post('/users/authenticate', UserController.authenticate)
routes.post('/users/forget_password', UserController.forgetPassword)
routes.get('/users/forget_password/verify/:token', UserController.verifyForgetPasswordToken)

export default routes
