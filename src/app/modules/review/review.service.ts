import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../helpers/errors/AppError';
import { IReview } from './review.interface';
import { Review } from './review.model';

// Add a Review
const addReview = async (userId: Types.ObjectId, payload: IReview) => {
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
) => {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Review not found ❌');
  }

  // Check if the authenticated user is the owner of the review
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
const deleteReview = async (reviewId: string, userId: string) => {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Review not found ❌');
  }

  // Check if the authenticated user is the owner of the review
  if (review.user.toString() !== userId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'You can only delete your own review 🔒',
    );
  }

  // Delete the review
  await review.deleteOne();
  return { message: 'Review deleted successfully ✔️' };
};

// Get all reviews for a product by product ID
const getAllReviews = async (query: Record<string, unknown>) => {
  const reviewsQuery = new QueryBuilder(
    Review.find({ product: query.productId }).populate('user'),
    query,
  )
    .filter()
    .paginate()
    .sort()
    .fields();

  const result = await reviewsQuery.modelQuery;
  const meta = await reviewsQuery.countTotal();
  return { result, meta };
};

export const reviewServices = {
  addReview,
  updateReview,
  deleteReview,
  getAllReviews,
};
