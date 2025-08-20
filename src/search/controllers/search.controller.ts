import { Controller, Get, Query, Param, HttpStatus, HttpException } from '@nestjs/common';
import { SearchService } from '../services/search.service';
import { SearchRequestDto } from '../dto/search-request.dto';
import { SearchResponseDto } from '../dto/search-response.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async searchProducts(@Query() searchDto: SearchRequestDto): Promise<SearchResponseDto[]> {
    try {
      return await this.searchService.searchProducts(searchDto);
    } catch (error) {
      throw new HttpException(
        'Search operation failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('products/:id')
  async getProductById(@Param('id') id: string): Promise<SearchResponseDto> {
    try {
      const product = await this.searchService.getProductById(id);
      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      return product;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('popular-queries')
  async getPopularQueries(@Query('limit') limit: number = 10): Promise<Array<{ query: string; count: number }>> {
    try {
      return await this.searchService.getPopularQueries(limit);
    } catch (error) {
      throw new HttpException(
        'Failed to fetch popular queries',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
