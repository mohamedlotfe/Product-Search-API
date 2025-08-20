import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'parent_id', type: 'uuid', nullable: true })
  parentId: string;

  @Column({ name: 'path', type: 'ltree', nullable: true })
  path: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Category, category => category.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Category;

  @OneToMany(() => Category, category => category.parent)
  children: Category[];
}
