import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './controllers/categories.controller';
import { CategoriesService } from './services/categories.service';
import { CategoryTreeService } from './services/category-tree.service';
import { CategoriesRepository } from './repositories/categories.repository';
import { Category } from './entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
  ],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    CategoryTreeService,
    CategoriesRepository,
  ],
  exports: [
    CategoriesService, // Public API for other modules
  ],
})
export class CategoriesModule {}
