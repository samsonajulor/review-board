import Joi from 'joi';

export const reviewSchema = Joi.object({
  reviewText: Joi.string().min(3).required().messages({
    'string.base': 'Review text must be a string',
    'string.min': 'Review text must be at least 3 characters long',
    'any.required': 'Review text is required',
  }),
});
