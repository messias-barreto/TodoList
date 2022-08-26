import { NextFunction, Request, Response } from "express";
import  JWT  from "jsonwebtoken";
import { authUser, createUser as createUserService } from "../services/UserService";

export class AuthController {
    async login(request: Request, response: Response) {
        const { login, password } = request.body;

        const user = await authUser(login, password);
        console.log(user.data.id)
        if(user.status === 200) {
            const refresh_token = JWT.sign({userToken: user.data.id}, process.env.REFRESH_SECRET, { expiresIn: 1600 });
            const token = JWT.sign({userToken: refresh_token }, process.env.SECRET, { expiresIn: '30s' });
            
            return response.status(user.status).json({user, token, refresh_token});
        }

        return response.status(user.status).json(user);
    }

    async refreshToken(request: Request, response: Response) {
        const { refresh_token } = request.body;

        const token = JWT.sign({userToken: refresh_token }, process.env.SECRET, { expiresIn: 1600 });
        return response.status(200).json({"token": token, "user": request.user}); 
    }
}