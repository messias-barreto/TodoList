import { Request, Response } from "express";
import { createWorks as createWorksService, getAllWorks, getOneWork, removeWork } from "../services/WorksService"

export class WorkController { 
    async getAll(request: Request, response: Response) {
        const { user_id } = request.params;
        const work = await getAllWorks(user_id);
        if(work instanceof Error) {
            return response.status(400).json(work.message);
        }

        return response.status(200).json(work);
    }

    async getOne(request: Request, response: Response) {
        const { id } = request.params;
        const work = await getOneWork(id);
        if(work instanceof Error) {
            return response.status(400).json(work.message);
        }

        return response.status(200).json(work);
    }

    async create(request: Request, response: Response) {
        const { title, description, user_id } = request.body

        const work = await createWorksService({ title, description, user_id });
        if(work instanceof Error){
            return response.status(400).json(work.message);
        }

        return response.status(200).json(work);
    }

    async remove(request: Request, response: Response) {
        const { id } = request.params;

        const work = await removeWork(id);
        return response.status(work.status).json(work);
    }

}