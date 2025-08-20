import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '../repositories/categories.repository';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryTreeService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async getCategoryTree(): Promise<Category[]> {
    const rootCategories = await this.categoriesRepository.findRootCategories();
    return Promise.all(
      rootCategories.map(category => this.buildCategoryTree(category))
    );
  }

  async buildCategoryTree(category: Category): Promise<Category> {
    const children = await this.categoriesRepository.findChildren(category.id);
    category.children = await Promise.all(
      children.map(child => this.buildCategoryTree(child))
    );
    return category;
  }

  async getCategoryPath(categoryId: string): Promise<Category[]> {
    const category = await this.categoriesRepository.findById(categoryId);
    if (!category) {
      return [];
    }

    const path: Category[] = [category];
    let current = category;

    while (current.parentId) {
      current = await this.categoriesRepository.findById(current.parentId);
      if (current) {
        path.unshift(current);
      } else {
        break;
      }
    }

    return path;
  }
}
