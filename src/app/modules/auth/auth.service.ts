import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';

import AppError from '../../helpers/errors/AppError';

import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { createToken, verifyToken } from '../../utils/createToken';
import { sendEmail } from '../../utils/sendEmail';
import { IUSer } from '../user/user.interface';
import { User } from '../user/user.model';
import { ILoginUser, TResetPassword } from './auth.interface';

// Auth services for handling authentication-related operations

// Register service for registering a new user
const register = async (payload: IUSer) => {
  //craete a new user with the provided payload
  const result = await User.create(payload);
  return result;
};

// Login service for logging in a user
const login = async (payload: ILoginUser) => {
  //check if the email exists in the database
  const user = await User.findOne({ email: payload.email }).select('+password');
  // Check if user exists
  if (!user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
  }
  // Check if user is blocked
  if (user.isBlocked) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'User is blocked');
  }
  //Check if password matches
  const isPasswordMatch = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordMatch) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid Password');
  }
  // define jwt payload
  const jwtPayload = {
    id: user?._id,
    email: user?.email,
    role: user?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    token: accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);
  const { email, iat } = decoded as JwtPayload;
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
  }
  if (user.isBlocked) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'User is blocked');
  }
  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      'Your password has changed, please login again',
    );
  }
  const jwtPayload = {
    id: user?._id,
    email: user?.email,
    role: user?.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );
  return {
    token: accessToken,
  };
};

const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
  }
  if (user.isBlocked) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'User is blocked');
  }

  const jwtPayload = {
    id: user?._id,
    email: user?.email,
    role: user?.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '1h',
  );

  //sending email to user with reset token
  const resetPasswordLink = `${config.reset_password_ui_link}?email=${user.email}&token=${resetToken}`;
  sendEmail(
    user.email,
    'Reset Password',
    `Reset Password Link`,
    resetPasswordLink,
  );
};

const resetPassword = async (email: string, payload: TResetPassword) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized');
  }
  if (user.isBlocked) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'User is blocked');
  }

  //hashing the new password
  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );
  //updating the password
  await User.findOneAndUpdate(
    { email },
    { password: hashedPassword, passwordChangedAt: Date.now() },
  );
};

export const authServices = {
  register,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
};
