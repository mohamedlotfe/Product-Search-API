import { Injectable, Logger } from '@nestjs/common';
import { ProductsService } from '../../products/products.service';

@Injectable()
export class SearchIndexingService {
  private readonly logger = new Logger(SearchIndexingService.name);

  constructor(
    private readonly productsService: ProductsService,
  ) {}

  async updateProductSearchVector(productId: string, searchVector: string): Promise<void> {
    try {
      await this.productsService.updateProductSearchVector(productId, searchVector);
      this.logger.log(`Updated search vector for product: ${productId}`);
    } catch (error) {
      this.logger.error(`Failed to update search vector for product: ${productId}`, error);
    }
  }

  async updateProductEmbedding(productId: string, embedding: number[]): Promise<void> {
    try {
      await this.productsService.updateProductEmbedding(productId, embedding);
      this.logger.log(`Updated embedding for product: ${productId}`);
    } catch (error) {
      this.logger.error(`Failed to update embedding for product: ${productId}`, error);
    }
  }

  async reindexAllProducts(): Promise<void> {
    // This would implement bulk reindexing logic
    this.logger.log('Starting bulk product reindexing...');
    // Implementation would depend on your specific requirements
  }
}
