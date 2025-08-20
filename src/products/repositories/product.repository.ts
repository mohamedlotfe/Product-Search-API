import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { Product } from "../entities/product.entity";
import { SearchRequestDto } from "../../search/dto/search-request.dto";

interface RawSearchResult {
  id: string;
  name: string;
  description: string;
  category_name: string;
  supplier_id: string;
  supplier_name: string;
  total_sales: number;
  popularity_score: number;
  final_score: number;
}

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dataSource: DataSource
  ) {}

  async searchProducts(searchDto: SearchRequestDto): Promise<RawSearchResult[]> {
    const query = `
      SELECT 
        p.id,
        p.name,
        p.description,
        c.name as category_name,
        s.id as supplier_id,
        s.name as supplier_name,
        pm.total_sales,
        pm.popularity_score,
        ts_rank_cd(p.search_vector, plainto_tsquery($1)) AS text_rank,
        (
          0.7 * ts_rank_cd(p.search_vector, plainto_tsquery($1)) +
          0.3 * (pm.popularity_score / NULLIF((SELECT MAX(popularity_score) FROM product_metrics),0))
        ) AS final_score
      FROM products p
      LEFT JOIN product_metrics pm ON p.id = pm.product_id
      JOIN categories c ON p.category_id = c.id
      JOIN suppliers s ON p.supplier_id = s.id
      WHERE p.status = 'active'
        AND ($2::uuid IS NULL OR p.category_id = $2)
        AND ($3::uuid IS NULL OR p.supplier_id = $3)
        AND ($4::decimal IS NULL OR EXISTS (
          SELECT 1 FROM product_variants pv 
          WHERE pv.product_id = p.id AND pv.price >= $4
        ))
        AND ($5::decimal IS NULL OR EXISTS (
          SELECT 1 FROM product_variants pv 
          WHERE pv.product_id = p.id AND pv.price <= $5
        ))
      ORDER BY final_score DESC
      LIMIT $6 OFFSET $7;
    `;

    const results = await this.dataSource.query(query, [
      searchDto.query,
      searchDto.categoryId || null,
      searchDto.supplierId || null,
      searchDto.priceMin || null,
      searchDto.priceMax || null,
      searchDto.limit,
      searchDto.offset,
    ]);

    return results;
  }

  async findById(id: string): Promise<Product> {
    return this.productRepository.findOne({
      where: { id },
      relations: ["supplier", "category", "variants", "metrics"],
    });
  }

  async updateSearchVector(productId: string, searchVector: string): Promise<void> {
    await this.productRepository.update(productId, { searchVector });
  }

  async updateEmbedding(productId: string, embedding: number[]): Promise<void> {
    await this.productRepository.update(productId, { embedding });
  }
}
