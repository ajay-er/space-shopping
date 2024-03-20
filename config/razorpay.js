const Razorpay = require('razorpay');
require('dotenv').config();

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function generateRazorpay(orders) {
  var options = {
    amount: orders.total * 100, 
    currency: 'INR',
    receipt: String(orders._id),
  };

  try {
    return instance.orders.create(options);
  } catch (error) {
    throw error;
  }
}

module.exports = { generateRazorpay };
