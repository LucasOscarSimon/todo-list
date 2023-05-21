import express, { Request, Response } from 'express';
import path from 'path';
import Tarea from './models/tarea';

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(express.static('public'));

const tareas: Tarea[] = [
  new Tarea(1, 'Tarea 1', 'Descripción de la tarea 1'),
  new Tarea(2, 'Tarea 2', 'Descripción de la tarea 2'),
  new Tarea(3, 'Tarea 3', 'Descripción de la tarea 3'),
];

app.get('/tareas', (req: Request, res: Response) => {
  res.render('tareas', { tareas: tareas });
});

app.get('/about', (req: Request, res: Response) => {
  res.render('about');
});

app.post('/tareas', (req: Request, res: Response) => {
  res.send('Tarea agregada con éxito');
});

app.delete('/tareas/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  res.send('Tarea eliminada con éxito');
});

app.put('/tareas/:id', (req: Request, res: Response) => {
  res.send('Tarea actualizada con éxito');
});

const port = 3000;
// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});