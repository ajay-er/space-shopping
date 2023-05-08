const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  streetAddress: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  email: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  isShippingAddress: {
    type: Boolean,
    default: false,
  },
  isBillingAddress: {
    type: Boolean,
    default: false,
  },
})

module.exports = mongoose.model('Address', addressSchema)
