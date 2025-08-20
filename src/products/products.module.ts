import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { ProductRepository } from "./repositories/product.repository";
import { ProductVariantRepository } from "./repositories/product-variant.repository";
import { ProductValidationService } from "./services/product-validation.service";
import { ProductEventsService } from "./services/product-events.service";
import { Product } from "./entities/product.entity";
import { ProductVariant } from "./entities/product-variant.entity";
import { ProductMetrics } from "./entities/product-metrics.entity";
import { SuppliersModule } from "../suppliers/suppliers.module";
import { CategoriesModule } from "../categories/categories.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductVariant, ProductMetrics]),
    SuppliersModule, // Products depend on suppliers
    CategoriesModule, // Products depend on categories
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductRepository,
    ProductVariantRepository,
    ProductValidationService,
    ProductEventsService,
  ],
  exports: [
    ProductsService,
    ProductValidationService, // Clean public API for other modules
  ],
})
export class ProductsModule {}
