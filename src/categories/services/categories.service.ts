import { Injectable, NotFoundException } from "@nestjs/common";
import { CategoriesRepository } from "../repositories/categories.repository";
import { CategoryTreeService } from "./category-tree.service";
import { CreateCategoryDto } from "../dto/create-category.dto";
import { UpdateCategoryDto } from "../dto/update-category.dto";
import { Category } from "../entities/category.entity";
import { CacheService } from "../../common/cache/cache.service";

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private readonly categoryTreeService: CategoryTreeService,
    private readonly cacheService: CacheService
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = await this.categoriesRepository.create(createCategoryDto);
    await this.cacheService.setCategory(category.id, category);
    return category;
  }

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.findAll();
  }

  async findById(id: string): Promise<Category> {
    // Try to get from cache first
    const cachedCategory = await this.cacheService.getCategory(id);
    if (cachedCategory) {
      return cachedCategory;
    }

    const category = await this.categoriesRepository.findById(id);
    if (!category) {
      throw new NotFoundException("Category not found");
    }

    // Cache the category
    await this.cacheService.setCategory(id, category);
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoriesRepository.findById(id);
    if (!category) {
      throw new NotFoundException("Category not found");
    }

    const updatedCategory = await this.categoriesRepository.update(id, updateCategoryDto);

    // Invalidate cache
    await this.cacheService.invalidateCategory(id);

    return updatedCategory;
  }

  async delete(id: string): Promise<void> {
    const category = await this.categoriesRepository.findById(id);
    if (!category) {
      throw new NotFoundException("Category not found");
    }

    await this.categoriesRepository.delete(id);

    // Invalidate cache
    await this.cacheService.invalidateCategory(id);
  }

  async getCategoryTree(): Promise<Category[]> {
    return this.categoryTreeService.getCategoryTree();
  }

  async getCategoryPath(categoryId: string): Promise<Category[]> {
    return this.categoryTreeService.getCategoryPath(categoryId);
  }

  // Public API for other modules
  async validateCategoryExists(categoryId: string): Promise<boolean> {
    const category = await this.categoriesRepository.findById(categoryId);
    return !!category;
  }
}
