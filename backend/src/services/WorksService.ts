import { Tasks } from "../entities/Tasks";
import { Works } from "../entities/Works";
import { WorksRepositories } from "../repositories/WorkRepositories"
import { removeLinkedTasks } from "./TasksServices";
import { findUser } from "./UserService";

interface IWorks {
    id?: string;
    title: string;
    description?: string;
    user_id: string
}

export const getAllWorks = async (user_id: string) => {
    const work = WorksRepositories;
    const user = await findUser(user_id);

    const find_works = await work.query(`
        SELECT 	works.id, 
		    works.title,
            COUNT(tasks.work_id) AS qtd_task,
            COUNT(tasks.work_id) FILTER (WHERE tasks.status = true) as qtd_complete
        FROM works
        LEFT JOIN tasks ON tasks.work_id = works.id
        WHERE user_id = '${user_id}'
        GROUP BY(works.id)
        ORDER BY works.title;
    `);

    if (!find_works) {
        return { "message": "Trabalho Não Encontrado", "data": {} }
    }

    return { "message": "Trabalho Encontrado", "data": find_works, "status": 200 }
}

export const getOneWork = async (id: string) => {
    const work = WorksRepositories;

    const find_works = await work.createQueryBuilder("works")
        .select(["works.title"])
        .where("works.id = :id", { id })
        .getOne()

    if (!find_works) {
        return { "message": "Trabalho Não Encontrado", "data": {} }
    }

    return { "message": "Trabalho Encontrado", "data": find_works, "status": 200 }
}

export const createWorks = async ({ title, description, user_id }: IWorks) => {
    const work = WorksRepositories;
    const user = await findUser(user_id);

    if (user.status === 400) {
        return { "message": "Erro ao Tentar Adicionar o Work!!", "data": {}, status: 400 }
    }

    const new_work = work.create({ title, description, user_id });
    await work.save(new_work);

    if (new_work instanceof Error) {
        return { "message": "Não foi possível Adicionar o Trabalho", "status": 400 }
    }

    return { "message": "Trabalho foi Adicionado!!", "data": new_work, "status": 200 }
}


export const removeWork = async (id: string) => {
    const work = WorksRepositories;
    await removeLinkedTasks(id);

    const new_work = work.createQueryBuilder("works")
    .delete()
    .from("works")
    .where("works.id = :id", { id })
    .execute();

    if (new_work instanceof Error) {
        return { "message": "Não foi possível Remover o Trabalho", "data": Error, "status": 400 }
    }

    return { "message": "Trabalho foi Removido!!", "status": 200 }
}