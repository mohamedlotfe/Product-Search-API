import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

export enum VariantStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock',
}

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ name: 'sku', type: 'varchar', length: 100, unique: true })
  sku: string;

  @Column({ name: 'variant_attributes', type: 'jsonb' })
  variantAttributes: Record<string, any>;

  @Column({ name: 'price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ name: 'inventory_count', type: 'integer', default: 0 })
  inventoryCount: number;

  @Column({ 
    name: 'status', 
    type: 'enum', 
    enum: VariantStatus, 
    default: VariantStatus.ACTIVE 
  })
  status: VariantStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Product, product => product.variants)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
