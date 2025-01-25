import { StatusCodes } from 'http-status-codes';
import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { authServices } from './auth.service';

// Auth controllers for handling authentication-related operations
// Register controller for registering a new user
const register = catchAsync(async (req, res) => {
  // Get payload from request body
  const payload = req.body;
  // Register the user
  const result = await authServices.register(payload);
  // Send response with the registered user data
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

//Login controller for logging in a user
const login = catchAsync(async (req, res) => {
  // Get payload from request body
  const payload = req.body;
  // Login the user
  const result = await authServices.login(payload);

  // Send response with the token
  const { token, refreshToken } = result;
  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: true,
    maxAge: 365 * 24 * 60 * 60 * 1000,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User logged in successfully',
    data: { token },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const result = await authServices.refreshToken(refreshToken);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Token refreshed successfully',
    data: result,
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const email = req.body.email;
  await authServices.forgotPassword(email);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Password reset link sent successfully',
    data: null,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const email = req.user?.email;

  const result = await authServices.resetPassword(email, req.body);
  sendResponse(res.clearCookie('refreshToken'), {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Password reset successfully',
    data: result,
  });
});

export const authControllers = {
  register,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
};
