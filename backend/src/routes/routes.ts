import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { TaskController } from '../controllers/TaskController';
import { UserController } from '../controllers/UserController';
import { WorkController } from '../controllers/WorksController';
import { AuthController as middleware, verifyRefreshToken as refresh } from '../middlewares/AuthMiddlewares';
const routes = Router()

routes.post('/auth', new AuthController().login)
routes.post('/refresh', refresh, new AuthController().refreshToken)

routes.get('/users', middleware, new UserController().AllUsers)
routes.post('/users', new UserController().create)
routes.put('/users/:id', middleware, new UserController().update)
routes.get('/users/:id', middleware, new UserController().findOneUser)

routes.get('/works/:user_id', middleware, new WorkController().getAll)
routes.get('/one-work/:id', middleware, new WorkController().getOne)
routes.post('/works', middleware, new WorkController().create)
routes.delete('/works/:id', middleware, new WorkController().remove)

routes.get('/tasks/:work_id', middleware, new TaskController().getAll)
routes.post('/tasks', middleware, new TaskController().create)
routes.patch('/tasks/:id', middleware, new TaskController().update_status)
routes.delete('/tasks/:id', middleware, new TaskController().remove)
 
export { routes }