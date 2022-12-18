import Joi from 'joi';

export const videoUploadValidator = Joi.object({
    data: Joi.string().required(),
});
