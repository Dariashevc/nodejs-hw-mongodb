import Joi from 'joi';
import { typeList } from '../constants/contacts.js';

export const contactAddSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': `Username should be a string`,
    'string.min': `Username should have at least {#limit} characters`,
    'string.max': `Username should have at most {#limit} characters`,
    'any.required': `Username is required`,
  }),
  phoneNumber: Joi.string().min(3).max(20).required().messages({
    'string.base': `Phone number should be a string`,
    'string.min': `Phone number should have at least {#limit} characters`,
    'string.max': `Phone number should have at most {#limit} characters`,
    'any.required': `Phone number is required`,
  }),
  email: Joi.string().email().min(3).max(20).messages({
    'string.base': `Email should be a string`,
    'string.min': `Email should have at least {#limit} characters`,
    'string.max': `Email should have at most {#limit} characters`,
    'string.email': `Enter a correct email`,
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .min(3)
    .max(20)
    .valid(...typeList)
    .required()
    .messages({
      'string.base': `Contact type should be a string`,
      'string.min': `Contact type should have at least {#limit} characters`,
      'string.max': `Contact type should have at most {#limit} characters`,
      'string.only': `The contact type must be one of the following:${typeList.join(
        ', ',
      )}`,
      'any.required': `Contact type is required`,
    }),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': `Username should be a string`,
    'string.min': `Username should have at least {#limit} characters`,
    'string.max': `Username should have at most {#limit} characters`,
  }),
  phoneNumber: Joi.string().min(3).max(20).messages({
    'string.base': `Phone number should be a string`,
    'string.min': `Phone number should have at least {#limit} characters`,
    'string.max': `Phone number should have at most {#limit} characters`,
  }),
  email: Joi.string().email().min(3).max(20).messages({
    'string.base': `Email should be a string`,
    'string.min': `Email should have at least {#limit} characters`,
    'string.max': `Email should have at most {#limit} characters`,
    'string.email': `Enter a correct email`,
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .min(3)
    .max(20)
    .valid(...typeList)
    .messages({
      'string.base': `Contact type should be a string`,
      'string.min': `Contact type should have at least {#limit} characters`,
      'string.max': `Contact type should have at most {#limit} characters`,
      'string.only': `The contact type must be one of the following:${typeList.join(
        ', ',
      )}`,
    }),
});
