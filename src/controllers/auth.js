import createHttpError from "http-errors";
import * as authServices from '../services/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { login } from "../services/auth.js";
const setupSession = (res, session)=> {
  const {_id, refreshToken, refreshTokenValidUntil} = session;

  res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      expires: refreshTokenValidUntil
  });

  res.cookie("sessionId", _id, {
      httpOnly: true,
      expires: refreshTokenValidUntil
  });
}

export const registerController = async (req, res, next) => {
  try {
    const data = await authServices.register(req.body);

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: data,
    });
  } catch (err) {
    next(err); 
  }
};

export const loginController = async (req, res, next) => {
  try {
    const session = await authServices.login(req.body);

    setupSession(res, session);

    res.json({
      status: 200,
      message: "Successfully login user",
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (err) {
    next(err); 
  }
};


export const refreshController = ctrlWrapper(async (req, res) => {
  const { refreshToken, sessionId } = req.cookies;

  if (!refreshToken || !sessionId) {
    throw createHttpError(401, 'Missing refresh token or session ID');
  }

  const newSession = await authServices.refreshSession({ refreshToken, sessionId });

  res.cookie('refreshToken', newSession.refreshToken, {
    httpOnly: true,
    expires: newSession.refreshTokenValidUntil,
  });

  res.cookie('sessionId', newSession._id, {
    httpOnly: true,
    expires: newSession.refreshTokenValidUntil,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
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
