import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.route';
import { userRoutes } from '../modules/user/user.route';

const router = Router();

// Routes for handling module-related operations
const moduleRoutes = [
  {
    path: '/auth',
    route: authRoutes, // Route for handling authentication-related operations
  },
  {
    path: '/users',
    route: userRoutes, // Route for handling user-related operations
  },
];

// Add routes to the router
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
