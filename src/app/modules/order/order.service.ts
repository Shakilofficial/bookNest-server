import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../helpers/errors/AppError';
import { Product } from '../product/product.model';
import { User } from '../user/user.model';
import { orderSearchableFields } from './order.constant';
import { Order } from './order.model';
import { orderUtils } from './order.utils';

const createOrder = async (
  user: JwtPayload,
  payload: { products: { product: string; quantity: number }[] },
  clientIp: string,
): Promise<string> => {
  if (!payload?.products?.length) {
    throw new AppError(
      StatusCodes.NOT_ACCEPTABLE,
      'No products specified in the order.',
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Fetch user details
    const foundUser = await User.findById(user.id).select(
      'name address email phone city',
    );

    if (!foundUser) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        'User not found. Please check your credentials.',
      );
    }

    let totalPrice = 0;

    const productDetails = await Promise.all(
      payload.products.map(async ({ product, quantity }) => {
        const foundProduct = await Product.findById(product).session(session);

        if (!foundProduct) {
          throw new AppError(
            StatusCodes.NOT_FOUND,
            `Product not found: ${product}`,
          );
        }

        if (foundProduct.quantity < quantity) {
          throw new AppError(
            StatusCodes.BAD_REQUEST,
            `Insufficient stock for product: ${foundProduct.title}`,
          );
        }

        // Calculate subtotal without updating product quantity
        const subtotal = foundProduct.price * quantity;
        totalPrice += subtotal;

        return { product, quantity };
      }),
    );

    // Create the order
    const order = await Order.create(
      [
        {
          user: user.id,
          products: productDetails,
          totalPrice,
        },
      ],
      { session },
    );

    // Prepare payment payload with user data
    const paymentPayload = {
      amount: totalPrice,
      order_id: order[0]._id,
      currency: 'BDT',
      customer_name: foundUser.name,
      customer_address: foundUser.address,
      customer_email: foundUser.email,
      customer_phone: foundUser.phone,
      customer_city: foundUser.city,
      client_ip: clientIp,
    };

    const payment = await orderUtils.makePaymentAsync(paymentPayload);

    if (payment?.transactionStatus) {
      await Order.findByIdAndUpdate(
        order[0]._id,
        {
          transaction: {
            id: payment.sp_order_id,
            transactionStatus: payment.transactionStatus,
          },
        },
        { session },
      );
    }

    await session.commitTransaction();
    session.endSession();

    return payment.checkout_url;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const verifyPayment = async (orderId: string) => {
  const paymentDetails = await orderUtils.verifyPaymentAsync(orderId);

  if (paymentDetails.length) {
    await Order.findOneAndUpdate(
      { 'transaction.id': orderId },
      {
        'transaction.bank_status': paymentDetails[0].bank_status,
        'transaction.sp_code': paymentDetails[0].sp_code,
        'transaction.sp_message': paymentDetails[0].sp_message,
        'transaction.transactionStatus': paymentDetails[0].transaction_status,
        'transaction.method': paymentDetails[0].method,
        'transaction.date_time': paymentDetails[0].date_time,
        status:
          paymentDetails[0].bank_status === 'Success'
            ? 'Paid'
            : paymentDetails[0].bank_status === 'Failed'
              ? 'Failed'
              : paymentDetails[0].bank_status === 'Cancel'
                ? 'Cancelled'
                : 'Pending',
      },
    );
  }

  return paymentDetails;
};

const getUserOrders = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  const ordersQuery = new QueryBuilder(
    Order.find({ user: userId }).populate({
      path: 'products.product',
      select: 'title price coverImage',
    }),
    query,
  )
    .search(orderSearchableFields)
    .filter()
    .paginate()
    .sort()
    .fields();

  const result = await ordersQuery.modelQuery;
  const meta = await ordersQuery.countTotal();

  return { result, meta };
};

const getAllOrders = async (query: Record<string, unknown>) => {
  const ordersQuery = new QueryBuilder(
    Order.find()
      .populate({
        path: 'user',
        select: 'name email',
      })
      .populate({
        path: 'products.product',
        select: 'title price',
      }),
    query,
  )
    .search(orderSearchableFields)
    .filter()
    .paginate()
    .sort()
    .fields();

  const result = await ordersQuery.modelQuery;
  const meta = await ordersQuery.countTotal();

  return { result, meta };
};

export const orderService = {
  createOrder,
  verifyPayment,
  getUserOrders,
  getAllOrders,
};
