import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier, SupplierStatus } from '../entities/supplier.entity';

@Injectable()
export class SupplierRepository {
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
}
