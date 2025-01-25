import { TOrderStatus } from './order.interface';

export const orderStatuses: TOrderStatus[] = [
  'Pending',
  'Paid',
  'Shipped',
  'Completed',
  'Cancelled',
];

// Constant for order searchable fields
export const orderSearchableFields = ['title', 'author', 'category'];
