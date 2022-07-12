import * as Joi from 'joi';

export const findAllReplies = Joi.object({
  param: Joi.object({
    id: Joi.number().required().positive().invalid(0),
  }),
  query: Joi.object({
    offset: Joi.number().optional().empty('').default(0),
    limit: Joi.number().optional().empty('').positive().default(10),
    latest: Joi.boolean().default(true),
  }),
});
