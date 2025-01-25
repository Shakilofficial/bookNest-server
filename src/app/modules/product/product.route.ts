import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { upload } from '../../utils/sendImageToCloudinary';
import { productControllers } from './product.controller';
import { productValidations } from './product.validation';

const router = Router();

// Routes for handling product-related operations

// Create product route for creating a new product
router.post(
  '/',
  auth('admin'),
  upload.single('coverImage'),
  validateRequest(productValidations.createProductValidationSchema),
  productControllers.createProduct,
);

// Route to update a product
router.patch(
  '/:id',
  auth('admin'),
  upload.single('coverImage'),
  validateRequest(productValidations.updateProductValidationSchema),
  productControllers.updateProduct,
);

export const productRoutes = router;
