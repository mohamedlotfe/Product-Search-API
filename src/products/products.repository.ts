import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { Product } from "./entities/product.entity";
import { ProductVariant, VariantStatus } from "./entities/product-variant.entity";
import { ProductMetrics } from "./entities/product-metrics.entity";
import { Supplier } from "./entities/supplier.entity";
import { Category } from "./entities/category.entity";
import { SearchRequestDto } from "./dto/search-request.dto";
import { SearchResponseDto } from "./dto/search-response.dto";

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,
    @InjectRepository(ProductMetrics)
    private readonly metricsRepository: Repository<ProductMetrics>,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly dataSource: DataSource
  ) {}

  async searchProducts(searchDto: SearchRequestDto): Promise<SearchResponseDto[]> {
    const query = `
      WITH q AS (SELECT $1::vector AS q_emb)
      SELECT 
        p.id,
        p.name,
        p.description,
        c.name as category_name,
        s.id as supplier_id,
        s.name as supplier_name,
        pm.total_sales,
        pm.popularity_score,
        (1 - (p.embedding <=> q.q_emb)) AS semantic_sim,
        ts_rank_cd(p.search_vector, plainto_tsquery($2)) AS text_rank,
        (
          0.5 * (1 - (p.embedding <=> q.q_emb)) +
          0.3 * ts_rank_cd(p.search_vector, plainto_tsquery($2)) +
          0.2 * (pm.popularity_score / NULLIF((SELECT MAX(popularity_score) FROM product_metrics),0))
        ) AS final_score
      FROM products p
      JOIN product_metrics pm ON p.id = pm.product_id
      JOIN categories c ON p.category_id = c.id
      JOIN suppliers s ON p.supplier_id = s.id, q
      WHERE p.status = 'active'
        AND ($3::uuid IS NULL OR p.category_id = $3)
        AND ($4::uuid IS NULL OR p.supplier_id = $4)
        AND ($5::decimal IS NULL OR EXISTS (
          SELECT 1 FROM product_variants pv 
          WHERE pv.product_id = p.id AND pv.price >= $5
        ))
        AND ($6::decimal IS NULL OR EXISTS (
          SELECT 1 FROM product_variants pv 
          WHERE pv.product_id = p.id AND pv.price <= $6
        ))
      ORDER BY final_score DESC
      LIMIT $7 OFFSET $8;
    `;

    // For now, we'll use a placeholder embedding (you'll need to integrate with an embedding service)
    const placeholderEmbedding = new Array(1536).fill(0.1); // OpenAI embedding size

    const results = await this.dataSource.query(query, [
      JSON.stringify(placeholderEmbedding),
      searchDto.query,
      searchDto.categoryId || null,
      searchDto.supplierId || null,
      searchDto.priceMin || null,
      searchDto.priceMax || null,
      searchDto.limit,
      searchDto.offset,
    ]);

    // Transform results and fetch related data
    const searchResults: SearchResponseDto[] = [];

    for (const result of results) {
      const variants = await this.variantRepository.find({
        where: { productId: result.id, status: VariantStatus.ACTIVE },
      });

      const variantDtos = variants.map((variant) => ({
        id: variant.id,
        sku: variant.sku,
        price: variant.price,
        inventory: variant.inventoryCount,
        attributes: variant.variantAttributes,
      }));

      searchResults.push({
        id: result.id,
        name: result.name,
        description: result.description,
        category: result.category_name,
        supplier: {
          id: result.supplier_id,
          name: result.supplier_name,
        },
        variants: variantDtos,
        metrics: {
          totalSales: result.total_sales,
          popularityScore: result.popularity_score,
        },
        score: result.final_score,
      });
    }

    return searchResults;
  }

  async getProductById(id: string): Promise<Product> {
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

  async getVariantById(id: string): Promise<ProductVariant> {
    return this.variantRepository.findOne({
      where: { id },
    });
  }

  async getSupplierById(id: string): Promise<Supplier> {
    return this.supplierRepository.findOne({
      where: { id },
    });
  }

  async getCategoryById(id: string): Promise<Category> {
    return this.categoryRepository.findOne({
      where: { id },
    });
  }
}
