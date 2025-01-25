import bcrypt from 'bcrypt';
import mongoose, { model, Schema } from 'mongoose';
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
    passwordChangedAt: {
      type: Date,
      default: Date.now(),
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    isBlocked: {
      type: Boolean,
      default: false,
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

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  const user = await this.findOne({ email }).select('+password').lean();
  return user;
};
userSchema.statics.isPasswordMatched = async function (
  plainPassword: string,
  hashedPassword: string,
) {
  const isPasswordMatched = await bcrypt.compare(plainPassword, hashedPassword);
  return isPasswordMatched;
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedAt: Date,
  jwtIssuedat: number,
) {
  const passwordChangedTime = new Date(passwordChangedAt).getTime() / 1000;
  return jwtIssuedat < passwordChangedTime;
};

export const User = model<IUSer, UserModel>('User', userSchema);
