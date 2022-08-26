import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import { Works } from "./Works";

@Entity()
export class Tasks {
    @PrimaryColumn()
    id: string;
    @Column({type: 'text'})
    title: string;
    @Column({type: 'text'})
    description: string;
    @Column({type: 'boolean', default: false})
    status: boolean;
    @Column({ type: 'text'})
    work_id: string;
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;
 

    @ManyToOne(() => Works)
    @JoinColumn({ name: 'work_id' })
    work: Works

    constructor() {
        if(!this.id){
            this.id = uuid();
        }
    }
}