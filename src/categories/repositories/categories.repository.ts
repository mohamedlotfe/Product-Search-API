import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findById(id: string): Promise<Category> {
    return this.categoryRepository.findOne({
      where: { id },
    });
  }

  async create(categoryData: Partial<Category>): Promise<Category> {
    const category = this.categoryRepository.create(categoryData);
    return this.categoryRepository.save(category);
  }

  async update(id: string, categoryData: Partial<Category>): Promise<Category> {
    await this.categoryRepository.update(id, categoryData);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.categoryRepository.delete(id);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findChildren(parentId: string): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { parentId },
    });
  }

  async findRootCategories(): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { parentId: null },
    });
  }
}
