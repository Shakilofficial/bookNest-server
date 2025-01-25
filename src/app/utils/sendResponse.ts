import { Response } from 'express';
import { TResponse } from '../types/response';

const sendResponse = <T>(
  res: Response,
  { statusCode, success, message = '', meta, data }: TResponse<T>,
) => {
  const isEmptyData =
    data === null || (Array.isArray(data) && data.length === 0);

  // Handle empty data with a valid response
  if (isEmptyData) {
    return res.status(statusCode).json({
      success,
      message: message || 'No content available',
      meta: meta || {},
      data: [],
    });
  }

  // Handle cases with actual data
  return res.status(statusCode).json({
    success,
    message,
    meta: meta || {},
    data,
  });
};

export default sendResponse;
