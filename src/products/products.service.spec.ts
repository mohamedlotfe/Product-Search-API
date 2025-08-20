import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SearchAnalytics } from './entities/search-analytics.entity';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: ProductsRepository;

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  const mockRepository = {
    searchProducts: jest.fn(),
    getProductById: jest.fn(),
  };

  const mockSearchAnalyticsRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductsRepository,
          useValue: mockRepository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: getRepositoryToken(SearchAnalytics),
          useValue: mockSearchAnalyticsRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<ProductsRepository>(ProductsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('searchProducts', () => {
    it('should return cached results if available', async () => {
      const searchDto = { query: 'test', limit: 20, offset: 0 };
      const cachedResults = [{ id: '1', name: 'Test Product' }];

      mockCacheManager.get.mockResolvedValue(cachedResults);

      const result = await service.searchProducts(searchDto);

      expect(result).toEqual(cachedResults);
      expect(mockCacheManager.get).toHaveBeenCalled();
      expect(repository.searchProducts).not.toHaveBeenCalled();
    });
  });
});
