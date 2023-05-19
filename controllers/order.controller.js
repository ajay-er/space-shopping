const {
  addOrderDetails,
  getAddresses,
  addAdrress,
  verifyPayment,
  changePaymentStatus,
  cancelOrder,
  returnOrder,
  deleteAddress,
  getAllOrders,
  changeOrderStatus,
  setSuccessStatus,
  getWallet,
  getUserData,
  updateCart,
  getWalletAndUpdate,
  updateWalletAmount,
} = require('../models/order.model');

const { cartProductTotal } = require('../models/cart.model');
const productDatabase = require('../schema/product.schema');

const { generateRazorpay } = require('../config/razorpay');
const { handleError } = require('../middlewares/error.handler');

/**
 * This function retrieves user addresses and cart product total and renders the checkout page with the
 * addresses if available, otherwise an empty array, or redirects to the cart page if the cart is
 * empty.
 * @param req - The `req` parameter is an object representing the HTTP request made by the client. It
 * contains information such as the request method, URL, headers, and any data sent in the request
 * body.
 * @param res - `res` is the response object that is used to send the HTTP response back to the client.
 * It is an instance of the `http.ServerResponse` class in Node.js. It is used to set the response
 * headers, status code, and send the response body. In this code snippet, `
 */
async function httpGetCheckout(req, res) {
  try {
    const cartResult = await cartProductTotal(req.session.user._id);

    if (cartResult.cart) {
     
      cartResult.cart.items.forEach(async (item) => {
        const product = await productDatabase.find({ _id: item.product });
        if (product[0].stocks < item.quantity) {
        return  res.redirect('/cart')
        }
      });
      
    }

    const result = await getAddresses(req.session.user._id, res);
    const userWallet = await getUserData(req.session.user._id);
    if (cartResult.status) {
      if (result.status) {
        return res.render('user/checkout', {
          addresses: result.addresses,
          walletAmount: userWallet.amount,
        });
      } else {
        return res.render('user/checkout', { addresses: [], walletAmount: userWallet.amount });
      }
    } else {
      return res.redirect('/cart');
    }
  } catch (error) {
    handleError(res, error);
  }
}

/**
 * This is an asynchronous function that adds an address to a user's account and returns a success or
 * failure message in JSON format.
 * @param req - The req parameter is an object that represents the HTTP request made to the server. It
 * contains information such as the request method, headers, URL, and request body. In this case, it is
 * being used to extract the request body and the user ID from the session.
 * @param res - The `res` parameter is the response object that is used to send the HTTP response back
 * to the client. It contains methods and properties that allow you to set the response status code,
 * headers, and body. In this case, it is being used to send a JSON response with a success flag and
 * @returns This function returns a JSON response with a success status and a message. If the
 * `addAddress` function returns a status of `true`, the success status is set to `true` and the
 * message is set to the `message` property of the `addressResult` object. If the `addAddress` function
 * returns a status of `false`, the success status is set to `false` and
 */

async function httpAddAddress(req, res) {
  try {
    const addressRsult = await addAdrress(req.body, req.session.user._id, res);
    if (addressRsult.status) {
      return res.json({ success: true, message: addressRsult.message });
    } else {
      return res.json({ success: false, message: addressRsult.message });
    }
  } catch (error) {
    handleError(res, error);
  }
}
/**
 * This function handles the HTTP POST request for checkout and generates the appropriate response
 * based on the payment method selected.
 * @param req - The request object represents the HTTP request that was sent by the client to the
 * server.
 * @param res - The "res" parameter is the response object that is used to send the response back to
 * the client making the HTTP request. It contains information such as the status code, headers, and
 * body of the response.
 * @returns a JSON response with different properties depending on the payment method selected by the
 * user. If the payment method is 'cashOnDelivery', the response includes a success flag, the payment
 * method used, and a message indicating that the order details were added successfully. If the payment
 * method is 'razorpay', the response includes the same properties as before, plus an additional
 * property 'order' that
 */

async function httpPostCheckout(req, res) {
  try {
    const { paymentmethod, addressId } = req.body;
    const checkoutResult = await addOrderDetails(
      addressId,
      paymentmethod,
      req.session.user._id,
      res,
    );

    if (checkoutResult.status) {
      if (paymentmethod === 'cashOnDelivery') {
        return res.json({
          success: true,
          paymethod: 'COD',
          message: 'order details added!',
          orderId: checkoutResult.order._id,
        });
      } else if (paymentmethod === 'razorpay') {
        const razorPayOrder = await generateRazorpay(checkoutResult.order);
        return res.json({
          success: true,
          paymethod: 'ONLINE',
          message: 'order details added!',
          order: razorPayOrder,
        });
      }
    } else {
      return res.json({ success: false, message: 'something goes wrong' });
    }
  } catch (error) {
    handleError(res, error);
  }
}

/**
 * This function verifies a payment and updates the payment status if successful.
 * @param req - The request object containing information about the incoming HTTP request.
 * @param res - `res` is the response object that is used to send the response back to the client who
 * made the HTTP request. It contains methods like `json()` to send a JSON response, `send()` to send a
 * plain text response, and `status()` to set the HTTP status code of the response
 * @returns a JSON response with either a success message and a message indicating that the payment
 * result has been updated, or a failure message indicating that something went wrong and the payment
 * result was not updated.
 */
async function httpVerifyPayment(req, res) {
  try {
    const verifyResult = await verifyPayment(req.body, res);
    if (verifyResult) {
      let razorpay_payment_id = req.body['payment[razorpay_payment_id]'];
      let razorpay_order_id = req.body['payment[razorpay_order_id]'];
      let razorpay_signature = req.body['payment[razorpay_signature]'];
      let paymentDetails = { razorpay_payment_id, razorpay_order_id, razorpay_signature };
      const changePaymentResult = await changePaymentStatus(
        req.body['order[receipt]'],
        paymentDetails,
      );
      if (changePaymentResult) {
        return res.json({ success: true, message: 'payment result updated' });
      } else {
        return res.json({
          success: false,
          message: 'something goes wrong!payment result not updated',
        });
      }
    }
  } catch (error) {
    handleError(res, error);
  }
}

/**
 * The code defines two async functions to render success and failed pages for a user.
 * @param req - The `req` parameter is an object that represents the HTTP request made by the client to
 * the server. It contains information such as the request method, URL, headers, and any data sent in
 * the request body.
 * @param res - `res` stands for response and it is an object that represents the HTTP response that an
 * Express app sends when it receives an HTTP request. It contains methods for sending the response
 * back to the client, such as `render()` which is used to render a view template and send the HTML
 * response to the
 */
async function httpSuccessPage(req, res) {
  const id = req.params.id;
  await setSuccessStatus(id);
  res.render('user/success-page');
}
async function httpFailedPage(req, res) {
  res.render('user/failed-page');
}

/**
 * This is an asynchronous function that cancels an order and returns a success or failure message in
 * JSON format.
 * @param req - The request object containing information about the incoming HTTP request.
 * @param res - The `res` parameter in the `httpCancelOrder` function is an object representing the
 * HTTP response that will be sent back to the client. It contains methods and properties that allow
 * the server to send data, headers, and status codes back to the client.
 */
async function httpCancelOrder(req, res) {
  try {
    const { id, cancelreason } = req.body;
    const cancelResult = await cancelOrder(id, cancelreason);
    if (cancelResult) {
      res.json({ message: 'order canceled successfully', success: true });
    } else {
      res.json({ success: false, message: 'something wrong! cancelled operation failed' });
    }
  } catch (error) {
    handleError(res, error);
  }
}
async function httpReturnOrder(req, res) {
  try {
    const { id, returnReason } = req.body;
    const cancelResult = await returnOrder(id, returnReason);
    if (cancelResult) {
      res.json({ message: 'order return successfully', success: true });
    } else {
      res.json({ success: false, message: 'something wrong! return operation failed' });
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function httpDeleteAddress(req, res) {
  try {
    const addressResult = await deleteAddress(req.body.id);
    if (addressResult) {
      res.redirect('/account');
    } else {
      res.redirect('/account');
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function httpGetOrderPage(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const orderResult = await getAllOrders(page, limit);
    return res.render('admin/orders', {
      orders: orderResult.orders,
      message: orderResult.message,
      totalPages: orderResult.totalPages,
      currentPage: orderResult.currentPage,
      limit: orderResult.limit,
      activePage: 'orders',
    });
  } catch (error) {
    handleError(res, error);
  }
}

async function httpChangeOrderStatus(req, res) {
  try {
    const { orderId, status } = req.body;
    const result = await changeOrderStatus(status, orderId);
    if (result.status) {
      return res.json({ success: true, message: result.message });
    } else {
      return res.json({ success: false, message: result.message });
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function httpGetWallet(req, res) {
  try {
    const walletAmount = await getWallet(req.session.user._id);
    if (walletAmount.status) {
      return res.render('user/wallet', {
        walletAmount: walletAmount.amount,
        walletPending: walletAmount.pendingWallet,
      });
    } else {
      return res.render('user/wallet', {
        walletAmount: walletAmount.amount,
        walletPending: walletAmount.pendingWallet,
      });
    }
  } catch (error) {
    handleError(res, error);
  }
}

// async function httpApplyWalllet(req, res) {
//   try {
//     const { id, walletApplied } = req.body;

//     if (!walletApplied) {
//       const result = await getWalletAndUpdate(req.session.user._id);
//       if (result.status) {
//         const cart = await updateCart(result.amount, id,true);
//         if (cart.status) {
//           return res.json({
//             success: true,
//             message: cart.message,
//             total: cart.total,
//             walletAmount: result.amount,
//           });
//         } else {
//           return res.json({
//             success: false,
//             message: cart.message,
//             total: cart.total,
//             walletAmount: result.amount,
//           });
//         }
//       } else {
//         return res.json({
//           success: false,
//           amount: result.amount,
//           message: result.message,
//           walletAmount: result.amount,
//         });
//       }
//     } else {
//       const result = await updateWalletAmout(req.session.user._id);
//       if(result.status){

//         const cart = await updateCart(result.amount, id,false);
//         if (cart.status) {
//           return res.json({
//             success: true,
//             message: cart.message,
//             total: cart.total,
//             walletAmount: result.amount,
//           });
//         } else {
//           return res.json({
//             success: false,
//             message: cart.message,
//             total: cart.total,
//             walletAmount: result.amount,
//           });
//         }

//       }else{
//         return res.json({
//           success: false,
//           amount: result.amount,
//           message: result.message,
//           walletAmount: result.amount,
//         });
//       }
//     }
//   } catch (error) {
//     handleError(res, error);
//   }
// }

async function httpApplyWallet(req, res) {
  try {
    const { id, walletApplied } = req.body;
    const userId = req.session.user._id;

    if (!walletApplied) {
      const result = await getWalletAndUpdate(userId);
      const cart = await updateCart(result.amount, id, true,userId);

      return res.json({
        success: true,
        message: cart.message,
        total: cart.total,
        walletAmount: result.amount,
      });
    } else {
      const result = await updateWalletAmount(userId);
      const cart = await updateCart(result.amount, id, false,userId);

      return res.json({
        success: true,
        message: cart.message,
        total: cart.total,
        walletAmount: result.amount,
      });
    }
  } catch (error) {
    handleError(res, error);
  }
}

module.exports = {
  httpGetCheckout,
  httpPostCheckout,
  httpAddAddress,
  httpVerifyPayment,
  httpSuccessPage,
  httpFailedPage,
  httpCancelOrder,
  httpReturnOrder,
  httpDeleteAddress,
  httpGetOrderPage,
  httpChangeOrderStatus,
  httpGetWallet,
  httpApplyWallet,
};
