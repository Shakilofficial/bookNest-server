import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { reviewServices } from './review.service';

// Add Review Controller
const addReview = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const { id } = req.user as JwtPayload;
  const payload = { ...req.body, user: id, product: productId };
  const result = await reviewServices.addReview(id, payload);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Review created successfully ✔️',
    data: result,
  });
});

// Update Review Controller
const updateReview = catchAsync(async (req, res) => {
  const { id } = req.user as JwtPayload;
  const reviewId = req.params.id;
  const payload = req.body;
  const result = await reviewServices.updateReview(reviewId, id, payload);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Review updated successfully ✔️',
    data: result,
  });
});

// Delete Review Controller
const deleteReview = catchAsync(async (req, res) => {
  const { id } = req.user as JwtPayload;
  const reviewId = req.params.id;
  const result = await reviewServices.deleteReview(reviewId, id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

// Get all Reviews by specific product ID
const getAllReviews = catchAsync(async (req, res) => {
  const { productId } = req.params; // You should use 'productId' here
  const result = await reviewServices.getReviewsByProductId(productId); // Use the renamed function
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Reviews retrieved successfully ✔️',
    data: result,
  });
});

export const reviewControllers = {
  addReview,
  updateReview,
  deleteReview,
  getAllReviews,
};
