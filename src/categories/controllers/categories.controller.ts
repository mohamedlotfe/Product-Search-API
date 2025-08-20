import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpException } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category } from '../entities/category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      return await this.categoriesService.create(createCategoryDto);
    } catch (error) {
      throw new HttpException(
        'Failed to create category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll(): Promise<Category[]> {
    try {
      return await this.categoriesService.findAll();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch categories',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('tree')
  async getCategoryTree(): Promise<Category[]> {
    try {
      return await this.categoriesService.getCategoryTree();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch category tree',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category> {
    try {
      return await this.categoriesService.findById(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/path')
  async getCategoryPath(@Param('id') id: string): Promise<Category[]> {
    try {
      return await this.categoriesService.getCategoryPath(id);
    } catch (error) {
      throw new HttpException(
        'Failed to fetch category path',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    try {
      return await this.categoriesService.update(id, updateCategoryDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    try {
      await this.categoriesService.delete(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to delete category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
