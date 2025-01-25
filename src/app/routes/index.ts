import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.route';
import { orderRoutes } from '../modules/order/order.route';
import { productRoutes } from '../modules/product/product.route';
import { reviewRoutes } from '../modules/review/review.route';
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
  {
    path: '/products',
    route: productRoutes, // Route for handling product-related operations
  },
  {
    path: '/orders',
    route: orderRoutes, // Route for handling order-related operations
  },
  {
    path: '/reviews',
    route: reviewRoutes, // Route for handling review-related operations
  },
];

// Add routes to the router
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
