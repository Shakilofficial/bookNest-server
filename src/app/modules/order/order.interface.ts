import { Types } from 'mongoose';

export type TOrderStatus =
  | 'Pending'
  | 'Paid'
  | 'Shipped'
  | 'Completed'
  | 'Cancelled';

export interface IOrder {
  user: Types.ObjectId;
  products: {
    product: Types.ObjectId;
    quantity: number;
  }[];
  totalPrice: number;
  status: TOrderStatus;
  transaction: {
    id: string;
    transactionStatus: string;
    bank_status: string;
    sp_code: string;
    sp_message: string;
    method: string;
    date_time: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
