/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import AppError from '../../helpers/errors/AppError';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

export const uploadCoverImage = async (
  file: any,
  title: string,
): Promise<string> => {
  const imageName = `${title}-${file.originalname}`;
  const filePath = file.path;

  try {
    const { secure_url } = await sendImageToCloudinary(imageName, filePath);
    return secure_url as string;
  } catch (error: any) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Image upload to Cloudinary failed',
    );
  }
};
