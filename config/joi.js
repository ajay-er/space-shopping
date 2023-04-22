const Joi = require('joi');

//signup
const signupSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().length(10).required(),
  password: Joi.string().required(),
  confirmpassword: Joi.string().required(),
  otp: Joi.string().required(),
  checkbox: Joi.optional(),
});

//add-product
const addProductSchema = Joi.object({
  productName: Joi.string().required(),
  productDescription: Joi.string().required(),
  productPrice: Joi.number().required(),
  productOldPrice: Joi.number().required(),
  stocks: Joi.number().required(),
  productCategory: Joi.string().required(),
  productImage: Joi.any().required(),
});

function validateSignup(userData) {
  return signupSchema.validateAsync(userData);
}

function validateProduct(productData) {
  return addProductSchema.validateAsync(productData);
}

module.exports = {
  validateSignup,
  validateProduct,
};
