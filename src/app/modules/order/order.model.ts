import { Schema, model } from 'mongoose';
import { orderStatuses } from './order.constant';
import { IOrder } from './order.interface';

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      required: true,
      enum: orderStatuses,
      default: 'Pending',
    },
    transaction: {
      id: {
        type: String,
        required: true,
      },
      transactionStatus: {
        type: String,
        required: true,
      },
      bank_status: {
        type: String,
        required: true,
      },
      sp_code: {
        type: String,
        required: true,
      },
      sp_message: {
        type: String,
        required: true,
      },
      method: {
        type: String,
        required: true,
      },
      date_time: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Create and export Order model
export const Order = model<IOrder>('Order', orderSchema);
