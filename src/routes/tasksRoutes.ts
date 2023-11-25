import { Router } from 'express';
import * as tareasController from '../controllers/tasksController';

const router = Router();

router.get('/tasks', tareasController.listTasks);
router.post('/tasks/add', tareasController.addTask);
router.post('/tasks/delete/:id', tareasController.deleteTask);
router.post('/tasks/update/:id', tareasController.updateTask);

export default router;