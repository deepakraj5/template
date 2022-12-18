import Joi from 'joi';

export const userSignupValidator = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().min(8).max(20).required(),
});

export const userLoginValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().min(8).max(20).required(),
});
