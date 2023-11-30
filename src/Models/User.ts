import { Document, Schema, model } from 'mongoose';
import { hashPassword } from '../utils/password';
interface IUser extends Document {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  gender: string;
  birthDate: Date;
  bio: string;
  website: string;
  profilePicture: string;
  coverPicture: string;
  blockedUsers: Array<String>;
  confirmed: boolean;
  verified: string;
  private: boolean;
  deleted: boolean;
  banned: boolean;
  themePreference: string;
  isDev: boolean;
  provider: string;
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: 3,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: 3,
    },
    userName: {
      type: String,
      // required: true,
      trim: true,
      minlength: 3,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      minlength: 1,
      unique: true,
    },
    password: {
      type: String,
      // required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    birthDate: {
      type: Date,
    },
    bio: {
      type: String,
    },
    website: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    coverPicture: {
      type: String,
    },
    blockedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    confirmed: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: String,
      // enum: ['true', 'false', 'dev'],
      default: 'false',
    },
    private: {
      type: Boolean,
      default: false,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    banned: {
      type: Boolean,
      default: false,
    },
    themePreference: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light',
    },
    isDev: {
      type: Boolean,
      default: false,
    },
    provider: {
      type: String,
      enum: ['google', 'facebook', 'local'],
      required: [true, 'Provider is required'],
    },
  },
  { timestamps: true }
);

userSchema.pre<IUser>('save', async function (this: IUser, next: any) {
  if (this.isModified('password')) {
    this.password = await hashPassword(this.password);
  }
  next();
});

const User = model<IUser>('User', userSchema);

export default User;
