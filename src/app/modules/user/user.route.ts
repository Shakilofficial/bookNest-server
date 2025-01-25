import { Router } from 'express';
import auth from '../../middlewares/auth';
import { userControllers } from './user.controller';

const router = Router();

// Routes for handling user-related operations : Authorized user access only

router.get('/me', auth('admin', 'user'), userControllers.getMe);
// Get single user route for retrieving a single user : Authorized user access only
router.get('/:id', auth('admin'), userControllers.getSingleUser);

// Block user route for blocking a user : Admin access only
router.patch('/:id', auth('admin'), userControllers.blockUser);

// Get all users route for retrieving all users : Admin access only
router.get('/', auth('admin'), userControllers.getAllUsers);

export const userRoutes = router;
