import * as Joi from 'joi';

export const createThoughtSchema = Joi.object({
  body: Joi.object({
    text: Joi.string().required().min(3).max(30),
    isAnonymous: Joi.boolean().default(false),
  }),
});
