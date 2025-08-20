import { Injectable, Logger } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject } from "@nestjs/common";
import { Cache } from "cache-manager";

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    try {
      return await this.cacheManager.get<T>(key);
    } catch (error) {
      this.logger.warn(`Failed to get cache key: ${key}`, error);
      return undefined;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl);
    } catch (error) {
      this.logger.warn(`Failed to set cache key: ${key}`, error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
    } catch (error) {
      this.logger.warn(`Failed to delete cache key: ${key}`, error);
    }
  }

  async reset(): Promise<void> {
    try {
      await this.cacheManager.reset();
    } catch (error) {
      this.logger.warn("Failed to reset cache", error);
    }
  }

  // Enhanced cache methods for domain-specific operations
  async getProduct(id: string): Promise<any> {
    return this.get(`product:${id}`);
  }

  async setProduct(id: string, product: any, ttl: number = 3600): Promise<void> {
    await this.set(`product:${id}`, product, ttl);
  }

  async invalidateProduct(id: string): Promise<void> {
    await this.del(`product:${id}`);
  }

  async getSearchResults(query: string, filters: any): Promise<any> {
    const key = this.generateSearchKey(query, filters);
    return this.get(key);
  }

  async setSearchResults(
    query: string,
    filters: any,
    results: any,
    ttl: number = 300
  ): Promise<void> {
    const key = this.generateSearchKey(query, filters);
    await this.set(key, results, ttl);
  }

  async invalidateSearchResults(query: string, filters: any): Promise<void> {
    const key = this.generateSearchKey(query, filters);
    await this.del(key);
  }

  async getSupplier(id: string): Promise<any> {
    return this.get(`supplier:${id}`);
  }

  async setSupplier(id: string, supplier: any, ttl: number = 1800): Promise<void> {
    await this.set(`supplier:${id}`, supplier, ttl);
  }

  async invalidateSupplier(id: string): Promise<void> {
    await this.del(`supplier:${id}`);
  }

  async getCategory(id: string): Promise<any> {
    return this.get(`category:${id}`);
  }

  async setCategory(id: string, category: any, ttl: number = 1800): Promise<void> {
    await this.set(`category:${id}`, category, ttl);
  }

  async invalidateCategory(id: string): Promise<void> {
    await this.del(`category:${id}`);
  }

  // Cache key generation utilities
  private generateSearchKey(query: string, filters: any): string {
    const keyParts = [
      "search",
      query,
      filters.categoryId || "all",
      filters.supplierId || "all",
      filters.priceMin || "min",
      filters.priceMax || "max",
      filters.limit || 20,
      filters.offset || 0,
    ];

    return keyParts.join(":");
  }

  // Cache statistics and monitoring
  async getCacheStats(): Promise<{ hits: number; misses: number; keys: number }> {
    // This would need to be implemented based on your Redis setup
    // For now, returning placeholder data
    return {
      hits: 0,
      misses: 0,
      keys: 0,
    };
  }

  // Bulk operations
  async invalidateByPattern(pattern: string): Promise<void> {
    try {
      // This would need Redis SCAN command implementation
      this.logger.log(`Invalidating cache pattern: ${pattern}`);
    } catch (error) {
      this.logger.warn(`Failed to invalidate cache pattern: ${pattern}`, error);
    }
  }

  async invalidateAllProducts(): Promise<void> {
    await this.invalidateByPattern("product:*");
  }

  async invalidateAllSuppliers(): Promise<void> {
    await this.invalidateByPattern("supplier:*");
  }

  async invalidateAllCategories(): Promise<void> {
    await this.invalidateByPattern("category:*");
  }
}
