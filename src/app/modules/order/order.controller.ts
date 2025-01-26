import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { orderService } from './order.service';

const createOrder = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const order = await orderService.createOrder(user, req.body, req.ip!);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Order placed successfully',
    data: order,
  });
});

const verifyPayment = catchAsync(async (req, res) => {
  const { order_id } = req.query;
  const order = await orderService.verifyPayment(order_id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Payment verified successfully',
    data: order,
  });
});

const getUserOrders = catchAsync(async (req, res) => {
  const { id } = req.user as JwtPayload;

  const orders = await orderService.getUserOrders(id, req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Orders retrieved successfully',
    meta: orders.meta,
    data: orders.result,
  });
});

const getAllOrders = catchAsync(async (req, res) => {
  const orders = await orderService.getAllOrders(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'All orders retrieved successfully',
    meta: orders.meta,
    data: orders.result,
  });
});

export const orderController = {
  createOrder,
  verifyPayment,
  getUserOrders,
  getAllOrders,
};
