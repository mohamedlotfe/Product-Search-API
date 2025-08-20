export class VariantDto {
  id: string;
  sku: string;
  price: number;
  inventory: number;
  attributes: Record<string, any>;
}

export class SupplierDto {
  id: string;
  name: string;
}

export class MetricsDto {
  totalSales: number;
  popularityScore: number;
}

export class SearchResponseDto {
  id: string;
  name: string;
  description?: string;
  category: string;
  supplier: SupplierDto;
  variants: VariantDto[];
  metrics: MetricsDto;
  score: number;
}
