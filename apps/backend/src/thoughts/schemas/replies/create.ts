import * as Joi from 'joi';

export const createReply = Joi.object({
  param: Joi.object({
    id: Joi.number().required().positive().invalid(0),
  }),
  body: Joi.object({
    text: Joi.string().required().min(3).max(30),
    isAnonymous: Joi.boolean().default(false),
  }),
});
