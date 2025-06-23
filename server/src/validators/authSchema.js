import Joi from "joi";

export const loginSchema = Joi.object({
    email:Joi.string().email().required().custom((value, helpers) => {
        if (!value.endsWith('@lumel.com')) {
            return helpers.error('email.domain');
        }
        return value;
    }).messages({
        'string.email': 'Email must be valid format',
        'email.domain': '@lumel.com emails are allowed',
        'any.required': 'Email is requird'
    }),
    password: Joi.string().required().messages({
        'string.empty': 'password is requird',
        'any.required': 'Email is requird'
    })
})