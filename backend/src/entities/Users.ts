import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import { RefreshToken } from "./RefreshToken";

@Entity()
export class Users {
    @PrimaryColumn()
    id: string;
    @Column({type: 'text'})
    name: string;
    @Column({type: 'text', unique: true})
    login: string;
    @Column({type: 'text', unique: true})
    email: string;
    @Column({type: 'text'})
    password: string;

    @OneToMany(type => RefreshToken, refreshToken => refreshToken.user)
    refreshTokens: RefreshToken

    constructor() {
        if(!this.id){
            this.id = uuid();
        }
    }
}