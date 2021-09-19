import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductDTO } from '../../dto/product/product.dto';
import { ProductService } from '../../service/product/product.service';

@Controller('api')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getHello(): string {
    return this.productService.getHello();
  }

  @Get('products')
  getCloudProviderList() {
    return this.productService.getProductList();
  }

  @Post('product')
  createProduct(@Body() productRequest: ProductDTO) {
    return this.productService.createProduct(productRequest);
  }

  @Post('products')
  bulkCreateProduct(@Body() bulkProductRequest: ProductDTO[]) {
    return this.productService.bulkCreateProduct(bulkProductRequest);
  }

  @Put('product/:productId')
  updateProductById(
    @Param('productId') productId: string,
    @Body() updateProductRequest: ProductDTO,
  ) {
    return this.productService.updateProductById(
      productId,
      updateProductRequest,
    );
  }

  @Delete('product/:productId')
  deleteProductById(@Param('productId') productId: string) {
    return this.productService.deleteProductById(productId);
  }
}
