import * as Joi from 'joi';

export const findAllThoughtsSchema = Joi.object({
  query: Joi.object({
    offset: Joi.number().optional().empty('').default(0),
    limit: Joi.number().optional().empty('').positive().default(10),
    latest: Joi.boolean().default(true),
  }),
});
