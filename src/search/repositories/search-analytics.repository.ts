import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SearchAnalytics } from "../entities/search-analytics.entity";

@Injectable()
export class SearchAnalyticsRepository {
  constructor(
    @InjectRepository(SearchAnalytics)
    private readonly searchAnalyticsRepository: Repository<SearchAnalytics>
  ) {}

  async create(analyticsData: Partial<SearchAnalytics>): Promise<SearchAnalytics> {
    const analytics = this.searchAnalyticsRepository.create(analyticsData);
    return this.searchAnalyticsRepository.save(analytics);
  }

  async findByQuery(query: string): Promise<SearchAnalytics[]> {
    return this.searchAnalyticsRepository.find({
      where: { query },
      order: { createdAt: "DESC" },
    });
  }

  async getPopularQueries(limit: number = 10): Promise<Array<{ query: string; count: number }>> {
    return this.searchAnalyticsRepository
      .createQueryBuilder("sa")
      .select("sa.query", "query")
      .addSelect("COUNT(*)", "count")
      .groupBy("sa.query")
      .orderBy("count", "DESC")
      .limit(limit)
      .getRawMany();
  }
}
