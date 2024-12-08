import createHttpError from "http-errors";
import * as authServices from "../services/auth.js";
import { sendResetEmail } from "../utils/sendResetEmail.js"; 
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import jwt from "jsonwebtoken";
import UserCollection from "../db/models/User.js";

const setupSession = (res, session) => {
    const { _id, refreshToken, refreshTokenValidUntil } = session;

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        expires: refreshTokenValidUntil,
    });

    res.cookie("sessionId", _id, {
        httpOnly: true,
        expires: refreshTokenValidUntil,
    });
};


export const registerController = ctrlWrapper(async (req, res) => {
    const data = await authServices.register(req.body);

    res.status(201).json({
        status: 201,
        message: "Successfully registered a user!",
        data: data, 
    });
});


export const loginController = ctrlWrapper(async (req, res) => {
    const session = await authServices.login(req.body);

    if (!session) {
        throw createHttpError(401, "Invalid email or password");
    }

    
    setupSession(res, session);

    res.json({
        status: 200,
        message: "Successfully logged in user",
        data: {
            accessToken: session.accessToken,
        },
    });
});


export const sendResetEmailController = ctrlWrapper(async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      throw createHttpError(400, "Email is required");
    }
  
    try {
      
      await sendResetEmail(email);
  
      
      res.status(200).json({
        status: 200,
        message: "Reset password email has been successfully sent.",
        data: {},
      });
    } catch (error) {
      
      throw createHttpError(500, "Failed to send the email, please try again later.");
    }
  });

  export const resetPasswordController = ctrlWrapper(async (req, res) => {
    const { token, password } = req.body;
  
    if (!token || !password) {
      throw createHttpError(400, "Token and password are required");
    }
  
    
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw createHttpError(401, "Token is expired or invalid.");
    }
  
    const { email } = decoded;
  
    
    const user = await UserCollection.findOne({ email });
  
    if (!user) {
      throw createHttpError(404, "User not found!");
    }
  
    
    const hashedPassword = await authServices.hashPassword(password);
  
    user.password = hashedPassword;
    await user.save();
  
    
    await authServices.logout(user._id);
  
    res.status(200).json({
      status: 200,
      message: "Password has been successfully reset.",
      data: {},
    });
  });


export const refreshController = ctrlWrapper(async (req, res) => {
    const { refreshToken, sessionId } = req.cookies;

    if (!refreshToken || !sessionId) {
        throw createHttpError(401, "Missing refresh token or session ID");
    }

    const newSession = await authServices.refreshSession({ refreshToken, sessionId });

    res.cookie("refreshToken", newSession.refreshToken, {
        httpOnly: true,
        expires: newSession.refreshTokenValidUntil,
    });

    res.cookie("sessionId", newSession._id, {
        httpOnly: true,
        expires: newSession.refreshTokenValidUntil,
    });

    res.status(200).json({
        status: 200,
        message: "Successfully refreshed session!",
        data: {
            accessToken: newSession.accessToken,
        },
    });
});


export const logoutController = ctrlWrapper(async (req, res) => {
    const { sessionId, refreshToken } = req.cookies;

    if (!sessionId || !refreshToken) {
        throw createHttpError(400, "Missing sessionId or refreshToken in cookies");
    }

    await authServices.logout(sessionId, refreshToken);

    res.clearCookie("sessionId");
    res.clearCookie("refreshToken");

    res.status(204).send();
});
