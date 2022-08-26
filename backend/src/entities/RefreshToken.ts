import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Users } from "./Users";
import { v4 as uuid } from "uuid";

@Entity()
export class RefreshToken {
    @PrimaryColumn()
    id: string;

    @Column({type: 'integer'})
    expiresIn: number;

    @Column({type: 'text'})
    user_id: string
    
    @ManyToOne(() => Users)
    @JoinColumn({ name: 'user_id'})
    user: Users

    constructor() {
        if(!this.id){
            this.id = uuid();
        }
    }

}