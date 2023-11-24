import { Router } from 'express';
import * as tareasController from '../controllers/tareasController';

const router = Router();

router.get('/tareas', tareasController.listarTareas);
router.post('/tareas/agregar', tareasController.agregarTarea);
router.post('/tareas/borrar/:id', tareasController.borrarTarea);
router.post('/tareas/actualizar/:id', tareasController.actualizarTarea);

export default router;