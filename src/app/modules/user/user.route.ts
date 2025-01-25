import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { userControllers } from './user.controller';
import { userValidations } from './user.validation';

const router = Router();

// Routes for handling user-related operations : Authorized user access only
router.patch(
  '/update-profile',
  auth('admin', 'user'),
  validateRequest(userValidations.updateUserValidationSchema),
  userControllers.updateProfile,
);

router.get('/me', auth('admin', 'user'), userControllers.getMe);
// Get single user route for retrieving a single user : Authorized user access only
router.get('/:id', auth('admin'), userControllers.getSingleUser);

// Block user route for blocking a user : Admin access only
router.patch('/:id', auth('admin'), userControllers.blockUser);

// Get all users route for retrieving all users : Admin access only
router.get('/', auth('admin'), userControllers.getAllUsers);

export const userRoutes = router;
