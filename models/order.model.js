const addressDatabase = require('../schema/address.schema');

async function addOrderDetails(addressData, userId) {
  try {
    const address = new addressDatabase({
      fname: addressData.fname,
      lname: addressData.lname,
      billing_address1: addressData.billing_address1,
      billing_address2: addressData.billing_address2,
      city: addressData.city,
      state: addressData.state,
      zipcode: addressData.zipcode,
      country: addressData.country,
      phone: addressData.phone,
      email: addressData.email,
      paymentmethod: addressData.paymentmethod,
      user: userId,
      isShippingAddress: true,
    });

    const result = await address.save();
    if (result) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error(`Error adding order details: ${error.message}`);
  }
}

module.exports = {
  addOrderDetails,
};
