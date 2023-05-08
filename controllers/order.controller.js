const { addOrderDetails } = require('../models/order.model');

const { handleError } = require('../middlewares/error.handler');

async function httpGetCheckout(req, res) {
  try {
    res.render('user/checkout');
  } catch (error) {
    handleError(res, error);
  }
}

async function httpPostCheckout(req, res) {
  try {
    console.log(req.body);
    const checkoutResult = await addOrderDetails(req.body,req.session.user._id);
    if(checkoutResult){

    }else{

    }
  } catch (error) {
    handleError(res, error);
  }
}

module.exports = {
  httpGetCheckout,
  httpPostCheckout,
};
