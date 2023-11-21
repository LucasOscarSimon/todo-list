import express, { Request, Response } from 'express';
import path from 'path';
import Tarea from './models/tarea';
import { PrismaClient } from '@prisma/client';
import Joi from 'joi';

const app = express();
const prisma = new PrismaClient();
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static('public'));

const tareaSchema = Joi.object({
  nombre: Joi.string().trim().required(),
  descripcion: Joi.string().trim().max(50).required()
});

app.get('/tareas', async (req: Request, res: Response) => {
  
  const tareasRaw = await prisma.tarea.findMany();
  const tareas = tareasRaw.map(t => new Tarea(t.id, t.nombre, t.descripcion));
  
  res.render('tareas', { tareas });

});

app.post('/tareas/agregar', async (req: Request, res: Response) => {
  
  try {

    await tareaSchema.validateAsync(req.body);

    const { nombreTarea, descripcionTarea } = req.body;

    const nuevaTarea = new Tarea(null, nombreTarea, descripcionTarea);

    const tarea = await prisma.tarea.create({
      data: {
        nombre: nuevaTarea.nombre,
        descripcion: nuevaTarea.descripcion,
      },
    });

      // Redirige o renderiza según sea necesario
      res.redirect('/tareas');
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      // Manejar errores de validación
      res.status(400).send(error.details.map(detail => detail.message).join(', '));
    } else {
      // Manejar otros errores
      res.status(500).send('Error interno del servidor');
    }
  }
});

app.post('/tareas/borrar/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const tarea = await prisma.tarea.delete({
    where: { id },
  });

  const tareas = await prisma.tarea.findMany();
  res.render('tareas', { tareas });
});

app.post('/tareas/actualizar/:id', async (req: Request, res: Response) => {  
  try {

    await tareaSchema.validateAsync(req.body);
    const id = parseInt(req.params.id);
    const { nombreTarea, descripcionTarea } = req.body;

    const tareaActualizada = new Tarea(id, nombreTarea, descripcionTarea);

    const tarea = await prisma.tarea.update({
      where: { id },
      data: {
        nombre: tareaActualizada.nombre,
        descripcion: tareaActualizada.descripcion,
      },
    });

    const tareas = await prisma.tarea.findMany();
    res.render('tareas', { tareas });
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      // Manejar errores de validación
      res.status(400).send(error.details.map(detail => detail.message).join(', '));
    } else {
      // Manejar otros errores
      res.status(500).send('Error interno del servidor');
    }
  }
});


const port = 3000;
// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
