import { Router } from 'express'

import UserController from '@controllers/UserController'

const routes = Router()

routes.post('/users', UserController.create)

routes.post('/users/authenticate', UserController.authenticate)
routes.post('/users/forget_password', UserController.forgetPassword)

export default routes
