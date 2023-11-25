import { Router } from 'express';
import * as tasksController from '../controllers/tasksController';

const router = Router();

router.get('/tasks', tasksController.listTasks);
router.post('/tasks/add', tasksController.addTask);
router.post('/tasks/delete/:id', tasksController.deleteTask);
router.post('/tasks/update/:id', tasksController.updateTask);

export default router;