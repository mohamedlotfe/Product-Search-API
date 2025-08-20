import { IsOptional, IsUUID, IsNumber, IsObject, Min, Max } from "class-validator";
import { Type } from "class-transformer";

export class SearchFiltersDto {
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsUUID()
  supplierId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceMax?: number;

  @IsOptional()
  @IsObject()
  variantAttributes?: Record<string, any>;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  minRating?: number;
}
