import * as Joi from 'joi';

export const deleteThoughtSchema = Joi.object({
  param: Joi.object({
    id: Joi.number().required().positive().invalid(0),
  }),
});
