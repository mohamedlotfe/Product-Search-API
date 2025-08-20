import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpException } from '@nestjs/common';
import { SuppliersService } from '../services/suppliers.service';
import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { UpdateSupplierDto } from '../dto/update-supplier.dto';
import { Supplier } from '../entities/supplier.entity';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  async create(@Body() createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    try {
      return await this.suppliersService.create(createSupplierDto);
    } catch (error) {
      throw new HttpException(
        'Failed to create supplier',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll(): Promise<Supplier[]> {
    try {
      return await this.suppliersService.findAll();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch suppliers',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Supplier> {
    try {
      return await this.suppliersService.findById(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch supplier',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateSupplierDto: UpdateSupplierDto): Promise<Supplier> {
    try {
      return await this.suppliersService.update(id, updateSupplierDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update supplier',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    try {
      await this.suppliersService.delete(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to delete supplier',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
