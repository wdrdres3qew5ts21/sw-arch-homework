import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop()
  price: number;

  @Prop()
  productName: string;

  @Prop()
  description: string;

  @Prop()
  productLine: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
