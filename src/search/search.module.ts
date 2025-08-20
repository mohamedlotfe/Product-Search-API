import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './controllers/search.controller';
import { SearchService } from './services/search.service';
import { SearchAnalyticsService } from './services/search-analytics.service';
import { SearchIndexingService } from './services/search-indexing.service';
import { SearchAnalyticsRepository } from './repositories/search-analytics.repository';
import { SearchAnalytics } from './entities/search-analytics.entity';
import { ProductsModule } from '../products/products.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SearchAnalytics]),
    ProductsModule, // Search depends on products
    CategoriesModule, // Search depends on categories
  ],
  controllers: [SearchController],
  providers: [
    SearchService,
    SearchAnalyticsService,
    SearchIndexingService,
    SearchAnalyticsRepository,
  ],
  exports: [
    SearchService,
    SearchIndexingService, // Public API for other modules
  ],
})
export class SearchModule {}
