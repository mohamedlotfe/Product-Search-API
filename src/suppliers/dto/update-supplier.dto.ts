import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { SupplierStatus } from '../entities/supplier.entity';

export class UpdateSupplierDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(SupplierStatus)
  status?: SupplierStatus;
}
