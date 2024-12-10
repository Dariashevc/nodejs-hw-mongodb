import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import UserCollection from "../db/models/User.js";
import "dotenv/config";

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM, JWT_SECRET, APP_DOMAIN } = process.env;


const nodemailerConfig = {
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: Number(SMTP_PORT) === 465, 
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
    },
};

const transport = nodemailer.createTransport(nodemailerConfig);


export const sendResetEmail = async (email) => {
    const user = await UserCollection.findOne({ email });

    if (!user) {
        throw createHttpError(404, "User not found!");
    }

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "5m" });

    const resetUrl = `${APP_DOMAIN}/reset-password?token=${token}`;

    const mailOptions = {
        to: email,
        subject: "Password Reset Request",
        text: `You can reset your password by visiting the following link: ${resetUrl}`,
        html: `<p>You can reset your password by visiting the following link: <a href="${resetUrl}">${resetUrl}</a></p>`,
    };

        res.status(200).json({
      status: 200,
      message: "Reset password email has been successfully sent.",
      data: {},
        });
    
    try {
        await transport.sendMail({ ...mailOptions, from: SMTP_FROM });
    } catch (error) {
        throw createHttpError(500, "Failed to send the email, please try again later.");
    }
};