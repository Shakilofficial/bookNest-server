import { Response } from 'express';
import { TResponse } from '../types/response';

const sendResponse = <T>(
  res: Response,
  { statusCode, success, message = '', meta, data }: TResponse<T>,
) => {
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return res.status(404).json({
      success: false,
      message: message || 'No Data Found',
      meta: meta || {},
      data: [],
    });
  }

  return res.status(statusCode).json({
    success,
    message,
    meta: meta || {},
    data,
  });
};

export default sendResponse;
