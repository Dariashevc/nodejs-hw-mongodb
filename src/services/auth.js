import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import UserCollection from "../db/models/User.js";
import SessionCollection from "../db/models/Session.js";
import { accessTokenLifetime, refreshTokenLifetime } from "../constants/users.js";

const createSession = () => {
  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: Date.now() + accessTokenLifetime,
    refreshTokenValidUntil: Date.now() + refreshTokenLifetime,
  };
};

export const register = async (payload) => {
  const { email, password } = payload;
  try {
    const user = await UserCollection.findOne({ email });
    if (user) {
      throw createHttpError(409, "Email already in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await UserCollection.create({ ...payload, password: hashPassword });

    const { password: _, ...userWithoutPassword } = newUser.toObject();
    return userWithoutPassword;
  } catch (err) {
    throw err; 
  }
};

export const login = async ({ email, password }) => {
  
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, "Invalid email or password");
  }

  
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, "Invalid email or password");
  }

  await SessionCollection.deleteOne({ userId: user._id });

  
  const newSession = createSession();

  return SessionCollection.create({
    userId: user._id,
    ...newSession,
  });

 
};

export const refreshSession = async ({ refreshToken, sessionId }) => {
  const existingSession = await SessionCollection.findOne({ _id: sessionId, refreshToken });

  if (!existingSession || existingSession.refreshTokenValidUntil < Date.now()) {
    throw createHttpError(401, 'Invalid or expired refresh token');
  }

  await SessionCollection.deleteOne({ _id: sessionId });

  const newSession = createSession();

  return SessionCollection.create({
    userId: existingSession.userId,
    ...newSession,
  });
};

export const logout = async (sessionId, refreshToken) => {
  
  const session = await SessionCollection.findOne({ _id: sessionId, refreshToken });

  if (!session) {
    throw createHttpError(404, "Session not found");
  }

  
  await SessionCollection.deleteOne({ _id: sessionId });

  
  return { message: "Session deleted successfully" };
};

