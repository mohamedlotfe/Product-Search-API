import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SuppliersRepository } from '../repositories/suppliers.repository';
import { SupplierStatus } from '../entities/supplier.entity';

@Injectable()
export class SupplierValidationService {
  constructor(
    private readonly suppliersRepository: SuppliersRepository,
  ) {}

  async validateSupplierExists(supplierId: string): Promise<boolean> {
    const supplier = await this.suppliersRepository.findActiveById(supplierId);
    return !!supplier;
  }

  async validateSupplierEmail(email: string, excludeId?: string): Promise<void> {
    // This would need to be implemented in the repository
    // For now, we'll assume it's valid
  }

  async getSupplierOwner(supplierId: string): Promise<string> {
    const supplier = await this.suppliersRepository.findById(supplierId);
    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }
    return supplier.id;
  }
}
