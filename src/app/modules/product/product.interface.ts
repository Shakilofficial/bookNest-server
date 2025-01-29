/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type TProductCategory =
  | 'Fiction'
  | 'Science'
  | 'SelfDevelopment'
  | 'Poetry'
  | 'Religious'
  | 'Fantasy'
  | 'Adventure'
  | 'Horror'
  | 'Romance'
  | 'Comedy'
  | 'Action'
  | 'Thriller'
  | 'Drama'
  | 'Western'
  | 'Mystery'
  | 'ScienceFiction'
  | 'History'
  | 'Technology';

export interface IProduct {
  title: string;
  author: string;
  price: number;
  category: TProductCategory;
  description: string;
  coverImage?: string;
  publishedAt?: Date;
  quantity: number;
  inStock: boolean;
  isDeleted: boolean;
}

// extend the interface with mongoose model
export interface ProductModel extends Model<IProduct, ProductModel> {
  // static method to check if a product exists
  isProductExist(_id: string): Promise<IProduct | null>;
  isProductExistsByTitle(title: string): Promise<IProduct | null>;
}
