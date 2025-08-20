import { Injectable, Logger } from "@nestjs/common";
import { ProductRepository } from "./repositories/product.repository";
import { ProductVariantRepository } from "./repositories/product-variant.repository";
import { SearchRequestDto } from "../search/dto/search-request.dto";
import { SearchResponseDto } from "../search/dto/search-response.dto";
import { CacheService } from "../common/cache/cache.service";

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
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private readonly productRepository: ProductRepository,
    private readonly variantRepository: ProductVariantRepository,
    private readonly cacheService: CacheService
  ) {}

  async searchProducts(searchDto: SearchRequestDto): Promise<SearchResponseDto[]> {
    const startTime = Date.now();

    try {
      // Try to get from cache first
      const cachedResult = await this.cacheService.getSearchResults(searchDto.query, searchDto);
      if (cachedResult) {
        this.logger.log(`Cache hit for query: ${searchDto.query}`);
        return cachedResult;
      }

      // Perform search
      const results = (await this.productRepository.searchProducts(searchDto)) as RawSearchResult[];

      // Transform results and fetch related data
      const searchResults: SearchResponseDto[] = [];

      for (const result of results) {
        const variants = await this.variantRepository.findByProductId(result.id);

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

      // Cache the results for 5 minutes
      await this.cacheService.setSearchResults(searchDto.query, searchDto, searchResults, 300);

      const searchTime = Date.now() - startTime;
      this.logger.log(`Search completed in ${searchTime}ms for query: ${searchDto.query}`);

      return searchResults;
    } catch (error) {
      this.logger.error(`Search failed for query: ${searchDto.query}`, error.stack);
      throw error;
    }
  }

  async getProductById(id: string): Promise<SearchResponseDto | null> {
    // Try to get from cache first
    const cachedProduct = await this.cacheService.getProduct(id);
    if (cachedProduct) {
      return cachedProduct;
    }

    const product = await this.productRepository.findById(id);
    if (!product) {
      return null;
    }

    // Transform to DTO
    const productDto: SearchResponseDto = {
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category?.name || "",
      supplier: {
        id: product.supplier?.id || "",
        name: product.supplier?.name || "",
      },
      variants:
        product.variants?.map((variant) => ({
          id: variant.id,
          sku: variant.sku,
          price: variant.price,
          inventory: variant.inventoryCount,
          attributes: variant.variantAttributes,
        })) || [],
      metrics: {
        totalSales: product.metrics?.totalSales || 0,
        popularityScore: product.metrics?.popularityScore || 0,
      },
      score: 0, // Not applicable for single product view
    };

    // Cache for 1 hour
    await this.cacheService.setProduct(id, productDto, 3600);

    return productDto;
  }

  async updateProductSearchVector(productId: string, searchVector: string): Promise<void> {
    await this.productRepository.updateSearchVector(productId, searchVector);

    // Invalidate cache
    await this.cacheService.invalidateProduct(productId);
  }

  async updateProductEmbedding(productId: string, embedding: number[]): Promise<void> {
    await this.productRepository.updateEmbedding(productId, embedding);

    // Invalidate cache
    await this.cacheService.invalidateProduct(productId);
  }
}
