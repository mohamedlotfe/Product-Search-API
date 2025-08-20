import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { SupplierStatus } from '../entities/supplier.entity';

export class CreateSupplierDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsEnum(SupplierStatus)
  status?: SupplierStatus = SupplierStatus.ACTIVE;
}
