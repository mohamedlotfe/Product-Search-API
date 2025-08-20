import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Product } from "../../products/entities/product.entity";

export enum SupplierStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}

@Entity("suppliers")
export class Supplier {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "name", type: "varchar", length: 255 })
  name: string;

  @Column({ name: "email", type: "varchar", length: 255, unique: true })
  email: string;

  @Column({
    name: "status",
    type: "enum",
    enum: SupplierStatus,
    default: SupplierStatus.ACTIVE,
  })
  status: SupplierStatus;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @OneToMany(() => Product, (product) => product.supplier)
  products: Product[];
}
