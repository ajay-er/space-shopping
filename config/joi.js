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
const addressSchema = Joi.object({
  fname: Joi.string().trim().pattern(/^[A-Za-z]+(?:[\s-][A-Za-z]+)*$/).required(),
  lname: Joi.string().trim().pattern(/^[A-Za-z]+(?:[\s-][A-Za-z]+)*$/).required(),
  country: Joi.string().trim().required(),
  street_address: Joi.string().trim().required(),
  city: Joi.string().trim().required(),
  state: Joi.string().trim().required(),
  zipcode: Joi.string().trim().pattern(/^\d+$/).required(),
  phone: Joi.string().trim().optional(),
  email: Joi.string().trim().email().optional(),
});

module.exports = {
  signupSchema,
  addProductSchema,
  addressSchema,
};
