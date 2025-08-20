import { Entity, PrimaryColumn, Column, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_metrics')
export class ProductMetrics {
  @PrimaryColumn({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ name: 'total_sales', type: 'integer', default: 0 })
  totalSales: number;

  @Column({ name: 'total_views', type: 'integer', default: 0 })
  totalViews: number;

  @Column({ name: 'total_reviews', type: 'integer', default: 0 })
  totalReviews: number;

  @Column({ name: 'average_rating', type: 'decimal', precision: 3, scale: 2, default: 0 })
  averageRating: number;

  @Column({ name: 'last_sale_date', type: 'timestamp', nullable: true })
  lastSaleDate: Date;

  @Column({ name: 'popularity_score', type: 'decimal', precision: 10, scale: 4, default: 0 })
  popularityScore: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => Product, product => product.metrics)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
