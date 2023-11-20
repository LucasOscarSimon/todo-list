import express, { Request, Response } from 'express';
import path from 'path';
import Tarea from './models/tarea';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static('public'));

app.get('/tareas', async (req: Request, res: Response) => {
  const tareas = await prisma.tarea.findMany();
  res.render('tareas', { tareas });
});

app.post('/tareas/agregar', async (req: Request, res: Response) => {
  const nuevaTarea = req.body.nombreTarea;
  const descripcion = req.body.descripcionTarea;

  const tarea = await prisma.tarea.create({
    data: {
      nombre: nuevaTarea,
      descripcion: descripcion,
    },
  });

  const tareas = await prisma.tarea.findMany();
  res.render('tareas', { tareas });
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
  const id = parseInt(req.params.id);
  const nuevaTarea = req.body.nombreTarea;
  const descripcion = req.body.descripcionTarea;

  const tarea = await prisma.tarea.update({
    where: { id },
    data: {
      nombre: nuevaTarea,
      descripcion: descripcion,
    },
  });

  const tareas = await prisma.tarea.findMany();
  res.render('tareas', { tareas });
});


const port = 3000;
// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
