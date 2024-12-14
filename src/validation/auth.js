import Joi from 'joi';
import { emailRegexp } from '../constants/users.js';

export const authRegisterSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.base': `Username should be a string`,
    'string.min': `Username should have at least {#limit} characters`,
    'string.max': `Username should have at most {#limit} characters`,
    'any.required': `Username is required`,
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.base': `Email should be a string`,
    'string.pattern.base': `Enter a correct email`,
    'any.required': `Email is required`,
  }),
  password: Joi.string().min(6).required().messages({
    'string.base': `Password should be a string`,
    'string.min': `Password should have at least {#limit} characters`,
    'any.required': `Password is required`,
  }),
});

export const authLoginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.base': `Email should be a string`,
    'string.pattern.base': `Enter a correct email`,
    'any.required': `Email is required`,
  }),
  password: Joi.string().min(6).required().messages({
    'string.base': `Password should be a string`,
    'string.min': `Password should have at least {#limit} characters`,
    'any.required': `Password is required`,
  }),
});

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.base': `Email should be a string`,
    'string.pattern.base': `Enter a correct email`,
    'any.required': `Email is required`,
  }),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).required().messages({
    'string.base': `Password should be a string`,
    'string.min': `Password should have at least {#limit} characters`,
    'any.required': `Password is required`,
  }),
  token: Joi.string().required().messages({
    'string.base': `Token should be a string`,
    'any.required': `Token is required`,
  }),
});
