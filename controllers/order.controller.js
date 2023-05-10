const { addOrderDetails, getAddresses, addAdrress } = require('../models/order.model');

const { handleError } = require('../middlewares/error.handler');

async function httpGetCheckout(req, res) {
  try {
    const addressResult = await getAddresses(req.session.user._id, res);
    if (addressResult.status) {
      res.render('user/checkout', { addresses: addressResult.addresses });
    } else {
      res.render('user/checkout', { addresses: [] });
    }
  } catch (error) {
    handleError(res, error);
  }
}
async function httpAddAddress(req, res) {
  try {
    const addressRsult =  await addAdrress(req.body,req.session.user._id,res)
    if(addressRsult.status){
      return res.json({success:true, message:addressRsult.message})
    }else{
      return res.json({success:false,message:addressRsult.message})
    }
  } catch (error) {
    handleError(res, error);
  }
}


async function httpPostCheckout(req, res) {
  try {
    console.log('😊😊');
    const { paymentmethod, addressId } = req.body;
    const checkoutResult = await addOrderDetails(
      addressId,
      paymentmethod,
      req.session.user._id,
      res,
    );

    if (checkoutResult.status) {
      if(paymentmethod==='cashOnDelivery'){
        return res.json({ success: true,paymethod:'COD', message: 'order details added!' });
      }else if(paymentmethod==='razorpay'){
        return res.json({ success: true,paymethod:'ONLINE',message: 'order details added!',order:checkoutResult.order });
      }
    } else {
      return res.json({ success: false, message: 'something goes wrong' });
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function httpVerifyPayment(req,res){
  try{
    
  }catch(error){
    handleError(res,error);
  }
}

module.exports = {
  httpGetCheckout,
  httpPostCheckout,
  httpAddAddress,
  httpVerifyPayment,
};
