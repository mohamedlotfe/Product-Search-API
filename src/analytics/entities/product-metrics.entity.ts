import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Product } from "../../products/entities/product.entity";

@Entity("product_metrics")
export class ProductMetrics {
  @PrimaryColumn({ name: "product_id", type: "uuid" })
  productId: string;

  @Column({ name: "total_sales", type: "integer", default: 0 })
  totalSales: number;

  @Column({ name: "total_views", type: "integer", default: 0 })
  totalViews: number;

  @Column({ name: "total_reviews", type: "integer", default: 0 })
  totalReviews: number;

  @Column({ name: "average_rating", type: "decimal", precision: 3, scale: 2, default: 0 })
  averageRating: number;

  @Column({ name: "last_sale_date", type: "timestamp", nullable: true })
  lastSaleDate: Date;

  @Column({ name: "popularity_score", type: "decimal", precision: 10, scale: 4, default: 0 })
  popularityScore: number;

  @Column({ name: "updated_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  // Relations
  @OneToOne(() => Product)
  @JoinColumn({ name: "product_id" })
  product: Product;
}
