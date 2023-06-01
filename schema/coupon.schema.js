const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  couponname: {
    type: String,
    unique: true,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discount: {
    type: Number,
    required: true,
    min: 0,
  },
  validFrom: {
    type: Date,
    required: true,
  },
  validUntil: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('Coupon', couponSchema);
