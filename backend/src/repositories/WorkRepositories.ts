import { AppDataSource } from "../database/data-source";
import { Works } from "../entities/Works";

const WorksRepositories = AppDataSource.getRepository(Works);
export { WorksRepositories }