import { Injectable, NotFoundException } from "@nestjs/common";
import { SuppliersRepository } from "../repositories/suppliers.repository";
import { SupplierValidationService } from "./supplier-validation.service";
import { CreateSupplierDto } from "../dto/create-supplier.dto";
import { UpdateSupplierDto } from "../dto/update-supplier.dto";
import { Supplier } from "../entities/supplier.entity";
import { CacheService } from "../../common/cache/cache.service";

@Injectable()
export class SuppliersService {
  constructor(
    private readonly suppliersRepository: SuppliersRepository,
    private readonly supplierValidationService: SupplierValidationService,
    private readonly cacheService: CacheService
  ) {}

  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    const supplier = await this.suppliersRepository.create(createSupplierDto);
    await this.cacheService.setSupplier(supplier.id, supplier);
    return supplier;
  }

  async findAll(): Promise<Supplier[]> {
    return this.suppliersRepository.findAll();
  }

  async findById(id: string): Promise<Supplier> {
    // Try to get from cache first
    const cachedSupplier = await this.cacheService.getSupplier(id);
    if (cachedSupplier) {
      return cachedSupplier;
    }

    const supplier = await this.suppliersRepository.findById(id);
    if (!supplier) {
      throw new NotFoundException("Supplier not found");
    }

    // Cache the supplier
    await this.cacheService.setSupplier(id, supplier);
    return supplier;
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto): Promise<Supplier> {
    const supplier = await this.suppliersRepository.findById(id);
    if (!supplier) {
      throw new NotFoundException("Supplier not found");
    }

    const updatedSupplier = await this.suppliersRepository.update(id, updateSupplierDto);

    // Invalidate cache
    await this.cacheService.invalidateSupplier(id);

    return updatedSupplier;
  }

  async delete(id: string): Promise<void> {
    const supplier = await this.suppliersRepository.findById(id);
    if (!supplier) {
      throw new NotFoundException("Supplier not found");
    }

    await this.suppliersRepository.delete(id);

    // Invalidate cache
    await this.cacheService.invalidateSupplier(id);
  }

  // Public API for other modules
  async validateSupplierExists(supplierId: string): Promise<boolean> {
    return this.supplierValidationService.validateSupplierExists(supplierId);
  }
}
