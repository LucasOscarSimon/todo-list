import express, {  } from 'express';
import path from 'path';
import tasksRoutes from './routes/tasksRoutes';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use('/api', tasksRoutes);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static('public'));


const port = 3000;
// Initialize the app
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
