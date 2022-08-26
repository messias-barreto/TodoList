import { AppDataSource } from "../database/data-source";
import { Users } from "../entities/Users";

const UsersRepositories = AppDataSource.getRepository(Users);
export { UsersRepositories }