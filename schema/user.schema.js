const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  address: [
    {
      type: Object,
    },
  ],
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart',
  },
});

module.exports = mongoose.model('User', userSchema);
