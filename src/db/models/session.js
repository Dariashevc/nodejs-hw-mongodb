import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const sessionSchema = new Schema(
    {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        accessToken: {
          type: String,
          required: true,
        },
        refreshToken: {
          type: String,
          required: true,
        },
        accessTokenValidUntil: {
          type: Date,
          required: true,
        },
        refreshTokenValidUntil: {
          type: Date,
          required: true,
        },
      },
      {
        timestamps: true,
      }
);

const SessionCollection = model('Session', sessionSchema);

export default SessionCollection;
