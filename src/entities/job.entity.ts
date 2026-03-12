import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('Jobs')
export class Job {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 30,
        unique: true
    })
    name: string

     

    @OneToMany(() => User, product => user.job)
    products: User[]

    @CreateDateColumn({
        name: 'created_at'
    })
    created_at: Date

    @UpdateDateColumn({
        name: 'updated_at'
    })
    updated_at: Date
}  