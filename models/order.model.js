const crypto = require('crypto');

const addressDatabase = require('../schema/address.schema');
const orderDatabase = require('../schema/order.schema');
const cartDatabase = require('../schema/cart.schema');

const { addressSchema } = require('../config/joi');
const { handleError } = require('../middlewares/error.handler');

async function getAddresses(userId, res) {
  try {
    const addresses = await addressDatabase.find({ user: userId });
    if (!addresses) {
      return { status: false };
    } else {
      return { status: true, addresses: addresses };
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

async function deleteAddress(addressId) {
  try {
    const result = await addressDatabase.findByIdAndDelete(addressId);
    console.log(result);
    if (result) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
}

async function addOrderDetails(addressId, paymentMethod, userId, res) {
  try {
    if (!['razorpay', 'cashOnDelivery', 'bankTransfer'].includes(paymentMethod)) {
      throw new Error('Invalid payment method');
    }

    //fetching the cart items and total
    const cartResult = await cartDatabase.findOne({ user: userId }).select('items total');

    if (cartResult) {
      //crate transaction id
      const transactionId = crypto
        .createHash('sha256')
        .update(`${Date.now()}-${Math.floor(Math.random() * 12939)}`)
        .digest('hex')
        .substr(0, 16);

      const orderStatus = paymentMethod === 'cashOnDelivery' ? 'processing' : 'pending';

      const order = new orderDatabase({
        user: userId,
        items: cartResult.items,
        shippingAddress: addressId,
        paymentmethod: paymentMethod,
        total: cartResult.total,
        transactionId: transactionId,
        status: orderStatus,
      });

      await order.save();
      await cartDatabase.deleteOne({ user: userId });

      return { status: true, order: order };
    } else {
      return { status: false };
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function verifyPayment(razorData, res) {
  try {
    var expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    expectedSignature.update(
      razorData['payment[razorpay_order_id]'] + '|' + razorData['payment[razorpay_payment_id]'],
    );

    expectedSignature = expectedSignature.digest('hex');

    if (expectedSignature === razorData['payment[razorpay_signature]']) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function changePaymentStatus(orderId, paymentDetails, res) {
  try {
    const changePaymentStatus = await orderDatabase.updateOne(
      { _id: orderId },
      {
        $set: {
          status: 'processing',
          paymentResponse: paymentDetails,
        },
      },
    );

    if (changePaymentStatus.modifiedCount > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function setSuccessStatus(orderId) { 
  try{
    const result = await orderDatabase.updateOne(
      { _id: orderId },
      {
        $set: {
          paymentStatus: 'success',
        },
      },
    );
    if(result){
      return true;
    }
  }catch(error){
    throw new Error('failed to change payment status!something wrong');
  }
}

async function fetchUserOrderDetails(userId, res) {
  try {
    const orders = await orderDatabase
      .find({ user: userId })
      .select('total status transactionId date items paymentStatus')
      .sort({ date: -1 });
    const addresses = await addressDatabase.find({ user: userId });

    const orderDetails = orders.map((order) => {
      // Calculate the return date
      const returnDate = new Date(order.date);
      returnDate.setDate(returnDate.getDate() + 7);

      return {
        productCount: order.items.length,
        date: order.date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }),
        returnDate: returnDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }),
        transactionId: order.transactionId,
        total: order.total,
        status: order.status,
        paymentStatus: order.paymentStatus,
        id: order._id,
      };
    });

    return { orderDetails: orderDetails, addresses: addresses };
  } catch (error) {
    handleError(res, error);
  }
}

async function cancelOrder(orderId,cancelReason) {
  try {
    const result = await orderDatabase.updateOne(
      { _id: orderId },
      {
        $set: {
          status: 'cancelPending',
          cancel_reason:cancelReason
        },
      },
    );
    return result.modifiedCount === 1;
  } catch (error) {
    console.log(error);
  }
}
async function returnOrder(orderId,returnreason) {
  try {
    const result = await orderDatabase.updateOne(
      { _id: orderId },
      {
        $set: {
          status: 'returnPending',
          return_reason:returnreason
        },
      },
    );
    return result?.modifiedCount === 1;
  } catch (error) {
    console.log(error);
  }
}

async function getAllOrders(page, limit) {
  try {
    const orders = await orderDatabase
      .find()
      .populate('user', 'username')
      .skip((page - 1) * limit)
      .limit(limit);

    if (!orders) {
      throw new Error('No orders found');
    }

    const totalOrders = await orderDatabase.countDocuments();
    const totalPages = Math.ceil(totalOrders / limit);

    return {
      status: true,
      limit: limit,
      orders: orders,
      totalPages: totalPages,
      currentPage: page,
      message: 'Orders found successfully',
    };
  } catch (error) {
    throw new Error('Failed to fetch orders from database');
  }
}

async function changeOrderStatus(changeStatus, orderId) {
  try {
    if (!['shipped', 'delivered', 'canceled','returned'].includes(changeStatus)) {
      throw new Error('Invalid status');
    }

    const orderResult = await orderDatabase.findByIdAndUpdate(orderId, {
      $set: {
        status: changeStatus,
      },
    });

    if (orderResult) {
      return { status: true, message: 'order updated' };
    } else {
      return { status: false, message: 'something goes wrong updation failed' };
    }
  } catch (error) {
    throw new Error('failed to change status!something wrong');
  }
}


async function getOrderData() {
  try {
    const orders = await orderDatabase
      .find({ status: "delivered" })
      .populate({
        path: "items.product",
        model: "Product",
      })
      .populate("shippingAddress")
      .populate("user");

    const reportData = [];

    for (const order of orders) {
      for (const item of order.items) {
        const { product, quantity, price } = item;

        const entry = {
          date: order.date,
          product: product.productName,
          quantity,
          price,
        };

        reportData.push(entry);
      }
    }
    return reportData;
  } catch (error) {
    throw new Error('Oops! Something went wrong while fetching order data');
  }
}


module.exports = {
  addOrderDetails,
  getAddresses,
  addAdrress,
  verifyPayment,
  changePaymentStatus,
  fetchUserOrderDetails,
  cancelOrder,
  returnOrder,
  deleteAddress,
  getAllOrders,
  changeOrderStatus,
  getOrderData,
  setSuccessStatus,
};
