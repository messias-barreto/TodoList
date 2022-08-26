import { AppDataSource } from "../database/data-source";
import { Tasks } from "../entities/Tasks";

const TaskRepositories = AppDataSource.getRepository(Tasks);
export { TaskRepositories };