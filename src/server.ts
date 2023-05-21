import express from 'express';
import path from 'path';
import Tarea from './models/tarea';

const app = express();
const port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const tareas: Tarea[] = [
  new Tarea(1, 'Tarea 1', 'Esta es la tarea 1'),
  new Tarea(2, 'Tarea 2', 'Esta es la tarea 2'),
  new Tarea(3, 'Tarea 3', 'Esta es la tarea 3'),
]

app.get('/tareas', (req, res) => {
  res.render('tareas', { tareas: tareas });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});