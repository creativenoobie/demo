import * as Joi from 'joi';

export const loginSchema = Joi.object({
  body: Joi.object({
    username: Joi.string().required().alphanum().min(3).max(30),
    password: Joi.string().required().min(8),
  }),
});
