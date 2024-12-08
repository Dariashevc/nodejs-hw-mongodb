import express from 'express';
import { registerController, loginController, refreshController, logoutController } from '../controllers/auth.js';
import validateBody from '../utils/validateBody.js';
import {authRegisterSchema, authLoginSchema} from '../validation/auth.js';
import { sendResetEmailController, resetPasswordController  } from '../controllers/auth.js';
import { emailSchema } from '../validation/auth.js';


const authRouter = express.Router();

authRouter.post('/register', validateBody(authRegisterSchema), registerController);

authRouter.post("/login", validateBody(authLoginSchema), loginController);
authRouter.post('/send-reset-email', validateBody(emailSchema), sendResetEmailController);
authRouter.post("/reset-pwd", resetPasswordController);

authRouter.post('/refresh', refreshController);
authRouter.post("/logout", logoutController);

export default authRouter;