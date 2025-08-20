import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('search_analytics')
export class SearchAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'query', type: 'text' })
  query: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string;

  @Column({ name: 'results_count', type: 'integer' })
  resultsCount: number;

  @Column({ name: 'clicked_product_id', type: 'uuid', nullable: true })
  clickedProductId: string;

  @Column({ name: 'search_time_ms', type: 'integer' })
  searchTimeMs: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
