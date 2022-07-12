import * as Joi from 'joi';

export const deleteReply = Joi.object({
  param: Joi.object({
    id: Joi.number().required().positive().invalid(0),
    replyId: Joi.number().required().positive().invalid(0),
  }),
});
