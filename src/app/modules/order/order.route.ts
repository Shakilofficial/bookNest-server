import { Router } from 'express';
import auth from '../../middlewares/auth';
import { orderController } from './order.controller';

const router = Router();

router.post('/', auth('user'), orderController.createOrder);
router.get('/verify', auth('user'), orderController.verifyPayment);
router.get('/', auth('user'), orderController.getUserOrders);
router.patch('/:id/status', auth('admin'), orderController.updateOrderStatus);
router.get('/all', auth('admin'), orderController.getAllOrders);

export const orderRoutes = router;
