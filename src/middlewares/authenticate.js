import createHttpError from "http-errors";
import SessionCollection from "../db/models/uession.js";
import UserCollection from "../db/models/user.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      throw createHttpError(401, "Authorization header missing");
    }

    const [bearer, token] = authHeader.split(" ");
    if (bearer !== "Bearer" || !token) {
      throw createHttpError(401, "Authorization header must be type Bearer and include token");
    }

    const session = await SessionCollection.findOne({ accessToken: token });
    if (!session) {
      throw createHttpError(401, "Session not found");
    }

    if (Date.now() > session.accessTokenValidUntil) {
      throw createHttpError(401, "Access token expired");
    }

    const user = await UserCollection.findById(session.userId);
    if (!user) {
      throw createHttpError(401, "User not found");
    }

    req.user = user; 
    next();
  } catch (err) {
    next(err);
  }
};