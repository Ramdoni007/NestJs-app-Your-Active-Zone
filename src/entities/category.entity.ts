import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 30
    })
    name: string

    @Column({
        type: 'text',
        nullable: true
    })
    description: string

    @OneToMany(() => Product, product => product.category)
    products: Product[]

    @CreateDateColumn({
        name: 'created_at'
    })
    created_at: Date

    @UpdateDateColumn({
        name: 'updated_at'
    })
    updated_at: Date
}  