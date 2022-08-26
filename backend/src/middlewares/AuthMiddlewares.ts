import { NextFunction, Request, Response } from "express";
import JWT from 'jsonwebtoken';

interface IToken {
    userToken: string;
    iat: number;
    exp: number
}

export async function AuthController(request: Request, response: Response, next: NextFunction) {
    const { authorization } = request.headers
    if(!authorization) {
        return response.status(401).end()
    }

    const token = authorization.replace('Bearer', '').trim();
    try{
        const data = JWT.verify(token, process.env.SECRET);
        const { userToken } = data as IToken;
        request.user = userToken;

        return next();
    } catch {
        return response.status(401).end()
    }
}


export async function verifyRefreshToken(request: Request, response: Response, next: NextFunction) {
    const { refresh_token } = request.body

        JWT.verify(refresh_token, process.env.REFRESH_SECRET, (error, user) => {
            if(error) { return response.status(401).json({"Message": "Middlware zoado"}) }
            request.user = user;
            next();
        })
}