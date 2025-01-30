import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import AppError from '../../helpers/errors/AppError';
import { Product } from '../product/product.model';
import { IReview } from './review.interface';
import { Review } from './review.model';

// Add a Review
const addReview = async (userId: Types.ObjectId, payload: IReview) => {
  const product = await Product.findById(payload.product);
  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Product not found ❌');
  }

  payload.user = userId;
  const review = await Review.create(payload);
  if (!review) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create review 🚫');
  }

  return review;
};

// Update Review
const updateReview = async (
  reviewId: string,
  userId: string,
  payload: IReview,
): Promise<IReview | null> => {
  // Specify the return type
  if (!Types.ObjectId.isValid(reviewId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid review ID 🚫');
  }

  const review = await Review.findById(reviewId);
  if (!review) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Review not found ❌');
  }

  if (review.user.toString() !== userId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'You can only update your own review 🔒',
    );
  }

  const updatedReview = await Review.findByIdAndUpdate(
    reviewId,
    { $set: payload },
    { new: true, runValidators: true },
  );

  if (!updatedReview) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to update review 🚫');
  }

  return updatedReview;
};

// Delete Review
const deleteReview = async (
  reviewId: string,
  userId: string,
): Promise<{ message: string }> => {
  if (!Types.ObjectId.isValid(reviewId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid review ID 🚫');
  }

  const review = await Review.findById(reviewId);
  if (!review) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Review not found ❌');
  }

  if (review.user.toString() !== userId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'You can only delete your own review 🔒',
    );
  }

  await review.deleteOne();
  return { message: 'Review deleted successfully ✔️' };
};

// Get all reviews for a product by product ID
const getReviewsByProductId = async (productId: string) => {
  // Fetch all reviews for the specific product
  const reviews = await Review.find({ product: productId }).populate(
    'user',
    'name email profileImg',
  ); // Optionally populate the user information for the review

  return reviews;
};

export const reviewServices = {
  addReview,
  updateReview,
  deleteReview,
  getReviewsByProductId,
};
