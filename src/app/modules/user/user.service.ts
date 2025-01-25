/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../helpers/errors/AppError';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { userSearchableFields } from './user.constant';
import { IUSer, TUserRoles } from './user.interface';
import { User } from './user.model';

// User services for handling user-related operations

// Get single user service for retrieving a single user
const getSingleUser = async (id: string) => {
  // Get the user with the provided id
  const user = await User.findById(id);

  // Check if User exists
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  return user;
};

const getMe = async (id: string, role: TUserRoles) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  if (user.role !== role) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Access denied');
  }
  return user;
};

//authenticated user can update thier profile
const updateProfile = async (
  id: string,
  file: any,
  payload: Partial<IUSer>,
): Promise<IUSer | null> => {
  // Check if user exists
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found ❌');
  }

  // Check if the user is blocked
  if (user.isBlocked) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is blocked 🚫');
  }

  // Process and upload the file if provided
  if (file) {
    const imageName = `${id}-${file.originalname}`;
    const path = file.path;
    try {
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.profileImg = secure_url as string;
    } catch (error: any) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Image upload failed ❌',
      );
    }
  }

  // Update user profile in the database
  const result = await User.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true },
  );

  if (!result) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Failed to update user profile 🚫',
    );
  }

  return result;
};

//Blocked user
const blockUser = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  if (user.isBlocked) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is already blocked');
  }

  user.isBlocked = true;
  await user.save();
};

// Get all users service for retrieving all users
const getAllUsers = async (query: Record<string, unknown>) => {
  // Create a new query builder with the User model and query object
  const usersQuery = new QueryBuilder(User.find(), query)
    .search(userSearchableFields)
    .filter()
    .paginate()
    .sort()
    .fields();
  // Execute the query and return the result
  const result = await usersQuery.modelQuery;
  const meta = await usersQuery.countTotal();
  return { result, meta };
};

export const userServices = {
  getSingleUser,
  getAllUsers,
  getMe,
  blockUser,
  updateProfile,
};
