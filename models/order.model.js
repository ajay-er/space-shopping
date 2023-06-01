const crypto = require('crypto');

const addressDatabase = require('../schema/address.schema');
const orderDatabase = require('../schema/order.schema');
const cartDatabase = require('../schema/cart.schema');
const userDatabase = require('../schema/user.schema');
const productDatabase = require('../schema/product.schema');

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
    if (!['razorpay', 'cashOnDelivery'].includes(paymentMethod)) {
      throw new Error('Invalid payment method');
    }
    console.log('😁');
    //fetching the cart items and total
    const cartResult = await cartDatabase.findOne({ user: userId }).select('items total');
    console.log('😁🫡');
    if (cartResult) {
      //crate transaction id
      const transactionId = crypto
        .createHash('sha256')
        .update(`${Date.now()}-${Math.floor(Math.random() * 12939)}`)
        .digest('hex')
        .substr(0, 16);

    console.log('😁🫡');

      const orderStatus = paymentMethod === 'cashOnDelivery' ? 'processing' : 'pending';
      console.log('😁🫡');

      const order = new orderDatabase({
        user: userId,
        items: cartResult.items,
        shippingAddress: addressId,
        paymentmethod: paymentMethod,
        total: cartResult.total,
        transactionId: transactionId,
        status: orderStatus,
      });
      console.log('😁🫡');

      for (const item of cartResult.items) {
        const quantity = item.quantity;
        await productDatabase.findByIdAndUpdate(
          item.product,
          { $inc: { stocks: -quantity } },
          { new: true },
        );
      }
      console.log('😁🫡');

      const l = await order.save();
      console.log(l);
      const o = await cartDatabase.deleteOne({ user: userId });
      
      console.log(o);

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
  try {
    const result = await orderDatabase.updateOne(
      { _id: orderId },
      {
        $set: {
          paymentStatus: 'success',
        },
      },
    );
    if (result) {
      return true;
    }
  } catch (error) {
    throw new Error('failed to change payment status!something wrong');
  }
}

async function fetchUserOrderDetails(userId, res, page, limit) {
  try {
    const orders = await orderDatabase
      .find({ user: userId })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('total status transactionId date items paymentStatus')
      .sort({ date: -1 });

    const totalOrder = await orderDatabase.countDocuments();
    const totalPages = Math.ceil(totalOrder / limit);

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

    return {
      orderDetails: orderDetails,
      addresses: addresses,
      totalPages: totalPages,
      currentPage: page,
      limit: limit,
    };
  } catch (error) {
    handleError(res, error);
  }
}

async function cancelOrder(orderId, cancelReason) {
  try {
    const result = await orderDatabase.updateOne(
      { _id: orderId },
      {
        $set: {
          status: 'cancelPending',
          cancel_reason: cancelReason,
        },
      },
    );
    return result.modifiedCount === 1;
  } catch (error) {
    console.log(error);
  }
}
async function returnOrder(orderId, returnreason) {
  try {
    const result = await orderDatabase.updateOne(
      { _id: orderId },
      {
        $set: {
          status: 'returnPending',
          return_reason: returnreason,
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
    .sort({ date: -1 }) // Sort by date in descending order
    .populate('user', 'username')
    .skip((page - 1) * limit)
    .limit(limit);
  

  if (!orders || orders.length === 0) {
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
    if (!['shipped', 'delivered', 'canceled', 'returned'].includes(changeStatus)) {
      throw new Error('Invalid status');
    }

    const orderResult = await orderDatabase.findByIdAndUpdate(orderId, {
      $set: {
        status: changeStatus,
      },
    });

    if (changeStatus === 'returned') {
      const orderResult = await orderDatabase.findById(orderId).select('total user');
      const { total, user } = orderResult;
      const userResult = await userDatabase.findById(user);
      const wallet = userResult.wallet;

      const updatedWallet = wallet + total;

      const walletResult = await userDatabase.findByIdAndUpdate(user, {
        $set: {
          wallet: updatedWallet,
        },
      });
    }

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
      .find({ status: 'delivered' })
      .populate({
        path: 'items.product',
        model: 'Product',
      })
      .populate('shippingAddress')
      .populate('user');

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

async function getWallet(userId) {
  try {
    const amount = await userDatabase.findById(userId).select('wallet');

    const pendingOrders = await orderDatabase
      .find({
        user: userId,
        status: 'returnPending',
      })
      .select('total');

    let pendingAmount = 0;

    pendingOrders.forEach((order) => {
      pendingAmount += order.total;
    });

    if (amount) {
      return { status: true, amount: amount.wallet, pendingWallet: pendingAmount };
    } else {
      return { status: false, amount: 0, pendingWallet: pendingAmount };
    }
  } catch (error) {
    throw new Error('Oops! Something went wrong while fetching wallet');
  }
}

async function getUserData(userId) {
  try {
    const amount = await userDatabase.findById(userId).select('wallet');
    if (amount) {
      return { status: true, amount: amount.wallet };
    } else {
      return { status: false, amount: 0 };
    }
  } catch (error) {
    throw new Error('Error finding user!');
  }
}

async function getOrderdetails(orderId) {
  try {
    const orderData = await orderDatabase.findById(orderId)
    .populate({
      path: 'items.product',
      select: 'productName productPrice productImageUrls', 
      model: 'Product'
    })
    .populate({
      path: 'user',
      select: 'username email', 
      model: 'User'
    })
    .populate('shippingAddress');
   
    if (orderData) {
      return { status: true, orderData };
    } else {
      return { status: false };
    }
  } catch (error) {
    throw new Error('Error finding order!');
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
  getWallet,
  getUserData,
  getOrderdetails,
};
