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

//address
const addressValidator = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  country: Joi.string().required(),
  addressline1: Joi.string().required(),
  addressline2: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  postalCode: Joi.string().required(),
  phoneNumber: Joi.string().optional(),
  email: Joi.string().email().optional(),
  user: Joi.string().required(),
  isShippingAddress: Joi.boolean().optional(),
  isBillingAddress: Joi.boolean().optional(),
});


module.exports = {
  signupSchema,
  addProductSchema,
  addressValidator,
};
