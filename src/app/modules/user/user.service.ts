import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../helpers/errors/AppError';
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
const updateProfile = async (id: string, payload: Partial<IUSer>) => {
  //only update name,profileImg,phone,address,city
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  if (user.isBlocked) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is blocked');
  }
  const updatedUser = await User.findByIdAndUpdate(id, payload);
  return updatedUser;
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
