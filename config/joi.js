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
  productName: Joi.string().trim().min(2).max(100).required().messages({
    'string.base': 'Product title must be a string',
    'string.empty': 'Product title is required',
    'string.min': 'Product title must be at least 2 characters long',
    'string.max': 'Product title cannot exceed 100 characters'
  }),
  productDescription: Joi.string().trim().min(5).max(400).required().messages({
    'string.base': 'description must be a string',
    'string.empty': 'description is required',
    'string.min': 'description must be at least 5 characters long',
    'string.max': 'description cannot exceed 400 characters'
  }),
  productPrice: Joi.number().positive().required().messages({
    'number.base': 'Regular price must be a number',
    'number.positive': 'Regular price must be a positive number',
    'any.required': 'Regular price is required'
  }),
  productOldPrice: Joi.number().positive().required().messages({
    'number.base': 'Old price must be a number',
    'number.positive': 'Old price must be a positive number',
    'any.required': 'Old price is required'
  }),
  stocks: Joi.number().integer().positive().required().messages({
    'number.base': 'Stocks must be a number',
    'number.integer': 'Stocks must be an integer',
    'number.positive': 'Stocks must be a positive number',
    'any.required': 'Stocks is required'
  }),
  productCategory: Joi.string().required().messages({
    'any.required': 'Category is required'
  }),
  productImage: Joi.array().required().messages({
    'any.required': 'Product image is required'
  })
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

const updateUserSchema = Joi.object({
  profileimage: Joi.any().optional(),
  name: Joi.string().trim().min(2).max(100).optional(),
  email: Joi.string().trim().email().optional(),
  password: Joi.string().trim().min(6).max(30).optional(),
  npassword: Joi.string().trim().min(6).max(30).allow('').optional(),
  cpassword: Joi.any().valid(Joi.ref('npassword')).allow('').optional(),
});

module.exports = {
  signupSchema,
  addProductSchema,
  addressSchema,
  updateUserSchema
};
