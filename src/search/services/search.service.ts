import { Injectable, Logger } from "@nestjs/common";
import { ProductsService } from "../../products/products.service";
import { CategoriesService } from "../../categories/services/categories.service";
import { SearchAnalyticsService } from "./search-analytics.service";
import { SearchRequestDto } from "../dto/search-request.dto";
import { SearchResponseDto } from "../dto/search-response.dto";
import { CacheService } from "../../common/cache/cache.service";

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
    private readonly searchAnalyticsService: SearchAnalyticsService,
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

      // Validate category if provided
      if (searchDto.categoryId) {
        const categoryExists = await this.categoriesService.validateCategoryExists(
          searchDto.categoryId
        );
        if (!categoryExists) {
          throw new Error("Invalid category ID");
        }
      }

      // Perform search using products service
      const results = await this.productsService.searchProducts(searchDto);

      // Cache the results for 5 minutes
      await this.cacheService.setSearchResults(searchDto.query, searchDto, results, 300);

      // Log analytics
      const searchTime = Date.now() - startTime;
      await this.searchAnalyticsService.logSearch(searchDto, results.length, searchTime);

      this.logger.log(`Search completed in ${searchTime}ms for query: ${searchDto.query}`);

      return results;
    } catch (error) {
      this.logger.error(`Search failed for query: ${searchDto.query}`, error.stack);
      throw error;
    }
  }

  async getProductById(id: string): Promise<SearchResponseDto> {
    return this.productsService.getProductById(id);
  }

  async getPopularQueries(limit: number = 10): Promise<Array<{ query: string; count: number }>> {
    return this.searchAnalyticsService.getPopularQueries(limit);
  }
}
