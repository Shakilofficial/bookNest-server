import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { authControllers } from './auth.controller';
import { authValidations } from './auth.validation';

const router = Router();

// Register route for registering a new user
router.post(
  '/register',
  validateRequest(authValidations.registerValidationSchema),
  authControllers.register,
);

// Login route for logging in a registered user
router.post(
  '/login',
  validateRequest(authValidations.loginValidationSchema),
  authControllers.login,
);

// Refresh token route for refreshing the token
router.post('/refresh-token', authControllers.refreshToken);

// Forgot password route for sending a reset password link to the user
router.post(
  '/forgot-password',
  validateRequest(authValidations.forgetPasswordValidationSchema),
  authControllers.forgotPassword,
);

// Reset password route for resetting the password
router.post(
  '/reset-password',
  auth('admin', 'user'),
  validateRequest(authValidations.resetPasswordValidationSchema),
  authControllers.resetPassword,
);

export const authRoutes = router;
