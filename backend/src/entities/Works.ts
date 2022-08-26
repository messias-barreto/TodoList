import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import { Tasks } from "./Tasks";
import { Users } from "./Users";

@Entity()
export class Works {
    @PrimaryColumn()
    id: string;
    @Column({type: 'text'})
    title: string;
    @Column({type: 'text'})
    description: string;
    @Column({type: 'text'})
    user_id: string
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;
 

    @ManyToOne(() => Users)
    @JoinColumn({ name: 'user_id'})
    user: Users

    @OneToMany(() => Tasks, (tasks) => tasks.work_id, { 
        cascade: true 
    })
    @JoinColumn({ name: 'tasks'})
    tasks: Tasks[]

    constructor() {
        if(!this.id){
            this.id = uuid();
        }
    }
}