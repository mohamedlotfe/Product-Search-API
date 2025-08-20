import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariant, VariantStatus } from '../entities/product-variant.entity';

@Injectable()
export class ProductVariantRepository {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,
  ) {}

  async findById(id: string): Promise<ProductVariant> {
    return this.variantRepository.findOne({
      where: { id },
    });
  }

  async findByProductId(productId: string): Promise<ProductVariant[]> {
    return this.variantRepository.find({
      where: { productId, status: VariantStatus.ACTIVE },
    });
  }

  async findByProductIdAndStatus(productId: string, status: VariantStatus): Promise<ProductVariant[]> {
    return this.variantRepository.find({
      where: { productId, status },
    });
  }
}
