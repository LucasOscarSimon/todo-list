import express, { Request, Response } from 'express';
import path from 'path';
import Tarea from './models/tarea';

const app = express();

app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static('public'));

const tareas: Tarea[] = [
  new Tarea(1, 'Lavar la ropa', 'Mi vieja me pidió que lave la ropa'),
  new Tarea(2, 'Hacer Café', 'Chequear los ingredientes disponibles para hacer café'),
  new Tarea(3, 'Ir al trabajo', 'Chequear servicio meteorológico para ver si llueve'),
];

app.get('/tareas', (req: Request, res: Response) => {
  res.render('tareas', { tareas: tareas });
});

app.post('/tareas/agregar', (req: Request, res: Response) => {
  const nuevaTarea = req.body.nombreTarea;
  const descripcion = req.body.descripcionTarea;
  const id = tareas.length + 1;
  const tarea = new Tarea(id, nuevaTarea, descripcion);
  tareas.push(tarea);
  res.render('tareas', { tareas: tareas });
});

app.post('/tareas/borrar/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const tareaIndex = tareas.findIndex((tarea) => tarea.id.toString() === id);
  
  if (tareaIndex !== -1) {
    tareas.splice(tareaIndex, 1);
    res.render('tareas', { tareas: tareas });
  } else {
    res.status(404).send('Tarea no encontrada');
  }  
});

app.post('/tareas/actualizar/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const tareaIndex = tareas.findIndex((tarea) => tarea.id.toString() === id);
  
  if (tareaIndex !== -1) {
    const nuevaTarea = req.body.nombreTarea;
    const descripcion = req.body.descripcionTarea;
    tareas[tareaIndex].nombre = nuevaTarea;
    tareas[tareaIndex].descripcion = descripcion;
    res.render('tareas', { tareas: tareas });
  } else {
    res.status(404).send('Tarea no encontrada');
  }
});

const port = 3000;
// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
