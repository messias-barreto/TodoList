import { Request, Response } from "express";
import { create as createTaskService, getAllTasks, remove, updateStatusTask } from "../services/TasksServices";


export class TaskController { 
    async getAll (request: Request, response: Response) {
        const { work_id } = request.params;
        const tasks = await getAllTasks(work_id);

        if(tasks instanceof Error) {
            return response.status(400).json(tasks.message);
        }

        return response.status(200).json(tasks);
    }
    

    async create (request: Request, response: Response) {
        const { title, description, work_id} = request.body;
        
        const task = await createTaskService({title, description, work_id});
        return response.status(task.status).json(task);
    }

    async remove (request: Request, response: Response) {
        const { id } = request.params

        const taks = await remove(id);
        return response.status(taks.status).json(taks);
    }

    async update_status (request: Request, response: Response) {
        const { id } = request.params

        const task = await updateStatusTask(id)
        return response.status(task.status).json(task)
    }
}