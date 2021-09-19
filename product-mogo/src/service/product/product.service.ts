import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PRODUCT_LIST } from '../../constant/product.constant';
import { ProductDTO } from '../../dto/product/product.dto';
import { Product, ProductDocument } from '../../schema/product.schema';
@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  getMockProductList() {
    return PRODUCT_LIST;
  }

  getProductList() {
    return this.productModel.find();
  }

  createProduct(product: ProductDTO) {
    const createdProduct = new this.productModel(product);
    createdProduct.save();
  }

  bulkCreateProduct(productList: ProductDTO[]) {
    productList.forEach((product) => {
      const createdProduct = new this.productModel(product);
      createdProduct.save();
    });
  }

  async deleteProductById(productId: string) {
    const result = await this.productModel.findByIdAndDelete(productId);
    console.log('=== Delete Product ====');
    console.log(result);
  }

  async updateProductById(productId: string, updateProductRequest: ProductDTO) {
    const updatedProduct = await this.productModel.findById(productId);
    updatedProduct.productLine = updateProductRequest.productLine;
    updatedProduct.productName = updateProductRequest.productName;
    updatedProduct.price = updateProductRequest.price;
    updatedProduct.description = updateProductRequest.description;
    updatedProduct.save();
  }

  getHello(): string {
    return 'This is Product System 2077';
  }
}
