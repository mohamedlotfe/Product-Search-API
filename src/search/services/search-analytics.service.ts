import { Injectable, Logger } from '@nestjs/common';
import { SearchAnalyticsRepository } from '../repositories/search-analytics.repository';
import { SearchRequestDto } from '../dto/search-request.dto';

@Injectable()
export class SearchAnalyticsService {
  private readonly logger = new Logger(SearchAnalyticsService.name);

  constructor(
    private readonly searchAnalyticsRepository: SearchAnalyticsRepository,
  ) {}

  async logSearch(searchDto: SearchRequestDto, resultsCount: number, searchTimeMs: number): Promise<void> {
    try {
      await this.searchAnalyticsRepository.create({
        query: searchDto.query,
        resultsCount,
        searchTimeMs,
      });
    } catch (error) {
      this.logger.warn('Failed to log search analytics', error);
    }
  }

  async getPopularQueries(limit: number = 10): Promise<Array<{ query: string; count: number }>> {
    return this.searchAnalyticsRepository.getPopularQueries(limit);
  }

  async getSearchHistory(query: string): Promise<any[]> {
    return this.searchAnalyticsRepository.findByQuery(query);
  }
}
