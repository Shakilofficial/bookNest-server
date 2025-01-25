import bcrypt from 'bcrypt';
import { model, Schema } from 'mongoose';
import config from '../../config';
import { userRoles } from './user.constant';
import { IUSer, UserModel } from './user.interface';

// Define user schema
const userSchema = new Schema<IUSer, UserModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: userRoles,
      default: 'user',
    },
    profileImg: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Hash password before saving to database
userSchema.pre('save', async function (next) {
  const user = this as IUSer;
  // hasing the password using bcrypt and the salt rounds
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  // continue with the next middleware
  next();
});

//set '' after saving password
userSchema.post('save', function (doc) {
  doc.password = '';
});

export const User = model<IUSer, UserModel>('User', userSchema);
