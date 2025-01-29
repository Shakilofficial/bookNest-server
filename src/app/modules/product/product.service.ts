/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../helpers/errors/AppError';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { productSearchableFields } from './product.constant';
import { IProduct } from './product.interface';
import { Product } from './product.model';

// Create Product Service
const createProduct = async (
  file: any,
  payload: IProduct,
): Promise<IProduct> => {
  // Handle file upload if a file is provided
  if (file) {
    const imageName = `${Date.now()}-${file.originalname}`;
    const path = file.path;
    try {
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.coverImage = secure_url as string;
    } catch (error: any) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Image upload failed ❌',
      );
    }
  }

  // Create and save product
  const newProduct = await Product.create(payload);
  if (!newProduct) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create product 🚫');
  }

  return newProduct;
};

// Update Product Service
const updateProduct = async (
  id: string,
  file: any,
  payload: Partial<IProduct>,
): Promise<IProduct | null> => {
  // Check if product exists
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Product not found ❌');
  }

  // Handle file upload if a file is provided
  if (file) {
    const imageName = `${id}-${file.originalname}`;
    const path = file.path;
    try {
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.coverImage = secure_url as string;
    } catch (error: any) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Image upload failed ❌',
      );
    }
  }

  // Update product in the database
  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true },
  );

  if (!updatedProduct) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to update product 🚫');
  }

  return updatedProduct;
};

const getSingleProduct = async (id: string) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Product not found ❌');
  }
  if (product.isDeleted) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Product is deleted 🚫');
  }
  return product;
};

//product deleted data
const deleteProduct = async (id: string) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Product not found ❌');
  }
  product.isDeleted = !product.isDeleted;
  await product.save();
};

const getAllProducts = async (query: Record<string, unknown>) => {
  // Create a new query builder with the Product model and query object
  const productsQuery = new QueryBuilder(Product.find(), query)
    .search(productSearchableFields)
    .filter()
    .paginate()
    .sort()
    .fields();
  // Execute the query and return the result
  const result = await productsQuery.modelQuery;
  const meta = await productsQuery.countTotal();
  return { result, meta };
};

export const productServices = {
  createProduct,
  updateProduct,
  getSingleProduct,
  deleteProduct,
  getAllProducts,
};
