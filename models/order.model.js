const crypto = require('crypto');

const addressDatabase = require('../schema/address.schema');
const orderDatabase = require('../schema/order.schema');
const cartDatabase = require('../schema/cart.schema');

const { addressSchema } = require('../config/joi');
const { handleError } = require('../middlewares/error.handler');

async function getAddresses(userId, res) {
  try {
    const addresses = await addressDatabase.find({user:userId});
    if (!addresses) {
      return { status: false };
    } else {
      return { status: true, addresses:addresses };
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function addAdrress(addressData, userId, res) {
  try {
    const validation = addressSchema.validate(addressData, {
      abortEarly: false,
    });

    if (validation.error) {
      return { status: false, message: validation.error.details[0].message };
    }

    // Validate input
    if (!addressData || !userId) {
      throw new Error('Missing required input');
    }
    const address = new addressDatabase({
      fname: addressData.fname,
      lname: addressData.lname,
      street_address: addressData.street_address,
      city: addressData.city,
      state: addressData.state,
      zipcode: addressData.zipcode,
      country: addressData.country,
      phone: addressData.phone,
      email: addressData.email,
      user: userId,
      isShippingAddress: true,
    });

    const addressResult = await address.save();
    if (addressResult) {
      return { status: true, message: 'address added to the database' };
    } else {
      return { status: false, message: 'something wrong! address not added' };
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function addOrderDetails(addressId, paymentMethod, userId, res) {
  try {
    console.log('🥲');

    if (!['razorpay', 'cashOnDelivery', 'bankTransfer'].includes(paymentMethod)) {
      throw new Error('Invalid payment method');
    }

    //fetching the cart items and total
    const cartResult = await cartDatabase.findOne({ user: userId }).select('items total');

    //crate transaction id
    const transactionId = crypto
      .createHash('sha256')
      .update(`${Date.now()}-${Math.floor(Math.random() * 12939)}`)
      .digest('hex')
      .substr(0, 16);

    const orderStatus = (paymentMethod === 'cashOnDelivery')? 'processing': 'pending';

    const order = new orderDatabase({
      user: userId,
      items: cartResult.items,
      shippingAddress: addressId,
      paymentmethod: paymentMethod,
      total: cartResult.total,
      transactionId: transactionId,
      status:orderStatus
    });

   await order.save();
    await cartDatabase.deleteOne({ user: userId });

    return { status: true,order:order};
  } catch (error) {
    handleError(res, error);
  }
}

module.exports = {
  addOrderDetails,
  getAddresses,
  addAdrress,
};
