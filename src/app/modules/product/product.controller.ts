import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { IProduct } from './product.interface';
import { productServices } from './product.service';
import { productValidations } from './product.validation';

// Create Product Controller
const createProduct = catchAsync(async (req, res) => {
  const file = req.file;
  // Parse and validate payload
  const payload = req.body.data ? JSON.parse(req.body.data) : req.body;
  const parsedPayload = productValidations.createProductValidationSchema.parse({
    body: payload,
  }).body;

  // Call service layer to handle business logic
  const newProduct = await productServices.createProduct(
    file,
    parsedPayload as IProduct,
  );

  // Send success response
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Product created successfully ✔️',
    data: newProduct,
  });
});

// Update Product Controller
const updateProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const file = req.file;

  // Parse and validate payload
  const payload = req.body.data ? JSON.parse(req.body.data) : req.body;
  const parsedPayload = productValidations.updateProductValidationSchema.parse({
    body: payload,
  }).body;

  // Call service layer to handle business logic
  const updatedProduct = await productServices.updateProduct(
    id,
    file,
    parsedPayload as IProduct,
  );

  // Send success response
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Product updated successfully ✔️',
    data: updatedProduct,
  });
});

export const productControllers = {
  createProduct,
  updateProduct,
};
