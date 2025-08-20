import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier, SupplierStatus } from '../entities/supplier.entity';

@Injectable()
export class SuppliersRepository {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  async findById(id: string): Promise<Supplier> {
    return this.supplierRepository.findOne({
      where: { id },
    });
  }

  async findActiveById(id: string): Promise<Supplier> {
    return this.supplierRepository.findOne({
      where: { id, status: SupplierStatus.ACTIVE },
    });
  }

  async create(supplierData: Partial<Supplier>): Promise<Supplier> {
    const supplier = this.supplierRepository.create(supplierData);
    return this.supplierRepository.save(supplier);
  }

  async update(id: string, supplierData: Partial<Supplier>): Promise<Supplier> {
    await this.supplierRepository.update(id, supplierData);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.supplierRepository.delete(id);
  }

  async findAll(): Promise<Supplier[]> {
    return this.supplierRepository.find();
  }
}
