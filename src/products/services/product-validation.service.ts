import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { ProductRepository } from "../repositories/product.repository";
import { ProductVariantRepository } from "../repositories/product-variant.repository";
import { SuppliersService } from "../../suppliers/services/suppliers.service";
import { CategoriesService } from "../../categories/services/categories.service";

@Injectable()
export class ProductValidationService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly variantRepository: ProductVariantRepository,
    private readonly suppliersService: SuppliersService,
    private readonly categoriesService: CategoriesService
  ) {}

  // Public API methods for other modules
  async validateProductExists(productId: string): Promise<boolean> {
    const product = await this.productRepository.findById(productId);
    return !!product && product.status === "active";
  }

  async validateProductOwner(productId: string, supplierId: string): Promise<boolean> {
    const product = await this.productRepository.findById(productId);
    return !!product && product.supplierId === supplierId;
  }

  async validateVariantExists(variantId: string): Promise<boolean> {
    const variant = await this.variantRepository.findById(variantId);
    return !!variant && variant.status === "active";
  }

  async validateSupplierExists(supplierId: string): Promise<boolean> {
    return this.suppliersService.validateSupplierExists(supplierId);
  }

  async validateCategoryExists(categoryId: string): Promise<boolean> {
    return this.categoriesService.validateCategoryExists(categoryId);
  }

  // Business rule validation methods
  async validateProductPrice(productId: string, price: number): Promise<void> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    if (price < 0) {
      throw new BadRequestException("Price cannot be negative");
    }

    // Additional business rules can be added here
    if (price > 10000) {
      throw new BadRequestException("Price exceeds maximum allowed value");
    }
  }

  async validateInventoryLevel(variantId: string, quantity: number): Promise<void> {
    const variant = await this.variantRepository.findById(variantId);

    if (!variant) {
      throw new NotFoundException("Product variant not found");
    }

    if (variant.inventoryCount < quantity) {
      throw new BadRequestException("Insufficient inventory");
    }
  }

  // Getter methods for other modules (clean public API)
  async getProductOwner(productId: string): Promise<string> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return product.supplierId;
  }

  async getProductCategory(productId: string): Promise<string> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return product.categoryId;
  }
}
