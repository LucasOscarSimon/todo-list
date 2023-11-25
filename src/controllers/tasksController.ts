import { Request, Response } from 'express';
import Task from '../models/task';
import { PrismaClient } from '@prisma/client';
import Joi from 'joi';

const prisma = new PrismaClient();

// Data validation
const taskSchema = Joi.object({
    taskName: Joi.string().trim().required(),
    taskDescription: Joi.string().trim().max(50).required()
  });


export const listTasks = async (req: Request, res: Response) => {
      
  const rawTasks = await prisma.task.findMany();
  const tasks = rawTasks.map(t => new Task(t.id, t.name, t.description));
  
  res.render('tasks', { tasks });

};


export const addTask = async (req: Request, res: Response) => {

  try {

      await taskSchema.validateAsync(req.body);
  
      const { taskName, taskDescription } = req.body;
  
      const newTask = new Task(null, taskName, taskDescription);
  
      await prisma.task.create({
        data: {
          name: newTask.name,
          description: newTask.description,
        },
      });
  
        // Redirect or render as needed
        res.redirect('/tasks');
    } catch (error) {
      if (error instanceof Joi.ValidationError) {
        // Handle validation errors
        res.status(400).send(error.details.map(detail => detail.message).join(', '));
      } else {
        // Handle other errors
        res.status(500).send('Internal Server Error');
      }
    }
};


export const deleteTask = async (req: Request, res: Response) => {

  const id = parseInt(req.params.id);
  let message = '';
  
  if (await taskExists(id)) {
    await prisma.task.delete({ where: { id }});
    message = 'Task deleted successfully.';
  } else {
    message = 'Task not found.';
  }
  
  const tasks = await prisma.task.findMany();
  res.render('tasks', { tasks, message });

};
  


export const updateTask = async (req: Request, res: Response) => {
    
  try {

      await taskSchema.validateAsync(req.body);
      const id = parseInt(req.params.id);
      const { taskName, taskDescription } = req.body;
  
      const updatedTask = new Task(id, taskName, taskDescription);
  
      const task = await prisma.task.update({
        where: { id },
        data: {
          name: updatedTask.name,
          description: updatedTask.description,
        },
      });
  
      const tasks = await prisma.task.findMany();
      res.render('tasks', { tasks });
    } catch (error) {
      if (error instanceof Joi.ValidationError) {
        // Handle validation errors
        res.status(400).send(error.details.map(detail => detail.message).join(', '));
      } else {
        // Handle other errors
        res.status(500).send('Internal Server Error');
      }
    }
};


async function taskExists(id: number): Promise<boolean> {
  
  const task = await prisma.task.findFirst({
    where: { id },
  });

  return task !== null;
}

