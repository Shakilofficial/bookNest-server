import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { reviewControllers } from './review.controller';
import { reviewValidations } from './review.validation';

const router = Router();

// Routes for handling review-related operations
router.post(
  '/:productId/reviews',
  auth('user', 'admin'),
  validateRequest(reviewValidations.createReviewValidationSchema),
  reviewControllers.addReview,
);

router.patch(
  '/:id',
  auth('user', 'admin'),
  validateRequest(reviewValidations.updateReviewValidationSchema),
  reviewControllers.updateReview,
);

router.delete('/:id', auth('user', 'admin'), reviewControllers.deleteReview);

router.get('/product/:productId', reviewControllers.getAllReviews);

export const reviewRoutes = router;
