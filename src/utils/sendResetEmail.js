import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import UserCollection from "../db/models/user.js";
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

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });

    const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      secure: false, 
    });

    await transporter.sendMail({
      from: `"Your App" <${process.env.SMTP_FROM}>`,
      to: user.email,
      subject: "Password Reset",
      text: `Click the link to reset your password: ${resetLink}`,
      html: `<p>Click the link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
    });

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