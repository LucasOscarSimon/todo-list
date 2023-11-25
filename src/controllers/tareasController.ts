import { Request, Response } from 'express';
import Tarea from '../models/tarea';
import { PrismaClient } from '@prisma/client';
import Joi from 'joi';

const prisma = new PrismaClient();

// Validación de datos
const tareaSchema = Joi.object({
    nombreTarea: Joi.string().trim().required(),
    descripcionTarea: Joi.string().trim().max(50).required()
  });


export const listarTareas = async (req: Request, res: Response) => {
      
  const tareasRaw = await prisma.tarea.findMany();
  const tareas = tareasRaw.map(t => new Tarea(t.id, t.nombre, t.descripcion));
  
  res.render('tareas', { tareas });

};


export const agregarTarea = async (req: Request, res: Response) => {

  try {

      await tareaSchema.validateAsync(req.body);
  
      const { nombreTarea, descripcionTarea } = req.body;
  
      const nuevaTarea = new Tarea(null, nombreTarea, descripcionTarea);
  
      await prisma.tarea.create({
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
};


export const borrarTarea = async (req: Request, res: Response) => {

    const id = parseInt(req.params.id);
    let mensaje = '';
  
    if (await tareaExists(id)) {
        await prisma.tarea.delete({ where: { id }});
        mensaje = 'Tarea borrada con éxito.';
    } else {
        mensaje = 'Tarea no encontrada.';
    }
  
    const tareas = await prisma.tarea.findMany();
    res.render('tareas', { tareas, mensaje });

};
  


export const actualizarTarea = async (req: Request, res: Response) => {
    
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
};


async function tareaExists(id: number): Promise<boolean> {
    
    const tarea = await prisma.tarea.findFirst({
        where: { id },
    });

    return tarea !== null;
}

