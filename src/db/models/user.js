import mongoose from 'mongoose';
import { emailRegexp } from '../../constants/users';

const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
          unique: true,
          match: emailRegexp,
        },
        password: {
          type: String,
          required: true,
        },
      },
      {
        timestamps: true,
      }
);

const UserCollection = model('User', userSchema);

export default UserCollection;
