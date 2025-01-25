import { Router } from 'express';

const router = Router();

// Routes for handling module-related operations
const moduleRoutes = [
  {
    path: '/auth',
    route: authRoutes, // Route for handling authentication-related operations
  },
];

// Add routes to the router
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
