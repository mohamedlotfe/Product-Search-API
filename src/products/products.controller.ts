import { Controller, Get, Query, Param, HttpStatus, HttpException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { SearchRequestDto } from './dto/search-request.dto';
import { SearchResponseDto } from './dto/search-response.dto';

@Controller('search')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async searchProducts(@Query() searchDto: SearchRequestDto): Promise<SearchResponseDto[]> {
    try {
      return await this.productsService.searchProducts(searchDto);
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
      const product = await this.productsService.getProductById(id);
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
}
