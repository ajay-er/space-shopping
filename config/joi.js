const Joi = require('joi');

const signupSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().length(10).required(),
  password: Joi.string().required(),
  otp: Joi.string().required(),
});

module.exports = {
  validateSignup: (userData) => {
    return signupSchema.validateAsync(userData);
  },
};