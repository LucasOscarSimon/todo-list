import express, {  } from 'express';
import path from 'path';
import tareasRoutes from './routes/tareasRoutes';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use('/api', tareasRoutes);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static('public'));


const port = 3000;
// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
