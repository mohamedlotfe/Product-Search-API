import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { Supplier } from "../../suppliers/entities/supplier.entity";
import { Category } from "../../categories/entities/category.entity";
import { ProductVariant } from "./product-variant.entity";
import { ProductMetrics } from "../../analytics/entities/product-metrics.entity";

export enum ProductStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DRAFT = "draft",
}

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "supplier_id", type: "uuid" })
  supplierId: string;

  @Column({ name: "category_id", type: "uuid" })
  categoryId: string;

  @Column({ name: "name", type: "varchar", length: 500 })
  name: string;

  @Column({ name: "description", type: "text", nullable: true })
  description: string;

  @Column({ name: "brand", type: "varchar", length: 255, nullable: true })
  brand: string;

  @Column({ name: "base_price", type: "decimal", precision: 10, scale: 2, nullable: true })
  basePrice: number;

  @Column({
    name: "status",
    type: "enum",
    enum: ProductStatus,
    default: ProductStatus.ACTIVE,
  })
  status: ProductStatus;

  @Column({ name: "attributes", type: "jsonb", nullable: true })
  attributes: Record<string, any>;

  @Column({ name: "search_vector", type: "tsvector", nullable: true })
  searchVector: string;

  @Column({ name: "embedding", type: "jsonb", nullable: true })
  embedding: number[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @ManyToOne(() => Supplier, (supplier) => supplier.products)
  @JoinColumn({ name: "supplier_id" })
  supplier: Supplier;

  @ManyToOne(() => Category)
  @JoinColumn({ name: "category_id" })
  category: Category;

  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[];

  @OneToOne(() => ProductMetrics, (metrics) => metrics.product)
  metrics: ProductMetrics;
}
