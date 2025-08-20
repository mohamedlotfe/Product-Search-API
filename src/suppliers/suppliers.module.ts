import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuppliersController } from './controllers/suppliers.controller';
import { SuppliersService } from './services/suppliers.service';
import { SupplierValidationService } from './services/supplier-validation.service';
import { SuppliersRepository } from './repositories/suppliers.repository';
import { Supplier } from './entities/supplier.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Supplier]),
  ],
  controllers: [SuppliersController],
  providers: [
    SuppliersService,
    SupplierValidationService,
    SuppliersRepository,
  ],
  exports: [
    SuppliersService, // Public API for other modules
  ],
})
export class SuppliersModule {}
