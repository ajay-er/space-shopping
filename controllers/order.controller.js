const {
  addOrderDetails,
  getAddresses,
  addAdrress,
  verifyPayment,
  changePaymentStatus,
  cancelOrder,
  deleteAddress,
  getAllOrders,
  changeOrderStatus,
} = require('../models/order.model');

const { cartProductTotal } = require('../models/cart.model');

const { generateRazorpay } = require('../config/razorpay');
const { handleError } = require('../middlewares/error.handler');

async function httpGetCheckout(req, res) {
  try {
    const result = await getAddresses(req.session.user._id, res);
    const cartResult = await cartProductTotal(req.session.user._id);
    if (cartResult) {
      if (result.status) {
        res.render('user/checkout', { addresses: result.addresses });
      } else {
        res.render('user/checkout', { addresses: [] });
      }
    } else {
      res.redirect('/cart');
    }
  } catch (error) {
    handleError(res, error);
  }
}
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
        return res.json({ success: true, paymethod: 'COD', message: 'order details added!' });
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

async function httpSuccessPage(req, res) {
  res.render('user/success-page');
}
async function httpFailedPage(req, res) {
  res.render('user/failed-page');
}

async function httpCancelOrder(req, res) {
  console.log(req.body);
  try {
    const { id } = req.body;
    const cancelResult = await cancelOrder(id);
    if (cancelResult) {
      res.json({ message: 'order canceled successfully' });
    } else {
      res.json({ message: 'something wrong! cancelled operation failed' });
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
    const orderResult = await getAllOrders();
    return res.render('admin/orders', {
      orders: orderResult.orders,
      message: orderResult.message,
    });
  } catch (error) {
    handleError(res,error)
  }
}

async function httpChangeOrderStatus(req,res){
  try{
  const {orderId,status} =  req.body;
    const result = await changeOrderStatus(status,orderId);
    if(result.status){
      return res.json({success:true,message:result.message})
    }else{
      return res.json({success:false,message:result.message})

    }

  }catch(error){
    handleError(res,error)
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
  httpDeleteAddress,
  httpGetOrderPage,
  httpChangeOrderStatus,
};
