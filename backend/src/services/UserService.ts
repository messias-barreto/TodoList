import { Users } from "../entities/Users";
import { UsersRepositories } from "../repositories/UserRepositories";
import JWT from 'jsonwebtoken';

interface IUserRepositories {
    id?: string,
    name: string;
    login: string;
    password?: string;
    email?: string;
    admin?: boolean;
}


const generatePassword = (password: string) => {
    const bcrypt = require('bcryptjs');
    const salt = bcrypt.genSaltSync(10);
    
    return bcrypt.hashSync(password, salt);
}

const comparePassword = (password: string, hashPassword: string) => {
    const bcrypt = require('bcryptjs');
    return bcrypt.compare(password, hashPassword);
}
 
const createToken = (id: string) => {
        const token = JWT.sign({userToken: id}, process.env.SECRET, { expiresIn: 300 });
        const refresh_token = JWT.sign({userToken: id}, process.env.SECRET, { expiresIn: 300 });
        return token;
}

export const authUser = async (login: string, password: string) => {
    const user = UsersRepositories;
    const find_user = await user.createQueryBuilder()
                            .select(["user.id", "user.name", "user.login", "user.email", "user.password"])
                            .from(Users, "user")
                            .where("user.login = :login", { login })
                            .orWhere("user.email = :login", { password })
                            .getOne();

    if(!find_user){
        return { "message": "Usuário Não Encontrado", "data": {}, "status": 400 }
    }

    const password_validation = await comparePassword(password, find_user.password).then((res: boolean) => { return res })
    if(password_validation !== true) {
        return { "message": "Usuário Não Encontrado", "data": {}, "status": 400 }
    }

    const token = createToken(find_user.id);
    return { "message": "Usuário Encontrado", "data": {id: find_user.id, login: find_user.login, name: find_user.name}, "status": 200 }
}

export const createUser = async ({name, login, password, email}: IUserRepositories) => {
    const user = UsersRepositories;
    const new_user = user.create({name, login, password, email});

    new_user.password = generatePassword(new_user.password);
    await user.save(new_user);
    return new_user;
}

export const findAllUsers = async () => {
    const user = UsersRepositories;
    const find_user = await user.createQueryBuilder()
                            .select(["user.name", "user.login", "user.email"])
                            .from(Users, "user")
                            .getMany();

    if(!find_user){
        return { "message": "Usuário Não Encontrado", "data": {}, "status": 400 }
    }

    return { "message": "Usuário Encontrado", "data": find_user, "status": 200 }
}

export const findUser = async (id: string) => {
    const user = UsersRepositories;
    const find_user = await user.createQueryBuilder()
                            .select(["user.name", "user.login", "user.email"])
                            .from(Users, "user")
                            .where("user.id = :id", { id })
                            .getOne();

    if(!find_user){
        return { "message": "Usuário Não Encontrado", "data": {}, "status": 400 }
    }

    return { "message": "Usuário Encontrado", "data": find_user, "status": 200 }
}

export const updateUser = async ({name, login, password, email, id}: IUserRepositories) => {
    const user = UsersRepositories;

    const find_user = await findUser(id);
    if(find_user.status === 400) {
        return find_user;
    }

    const update_user = await user.createQueryBuilder()
    .update() 
    .set({ name: name, login: login, email: email })
    .where("id = :id", { id })
    .execute();

    return update_user;
}

