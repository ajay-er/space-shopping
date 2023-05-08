// const {  } = require('../models/order.model');

const { handleError } = require('../middlewares/error.handler');

async function httpGetCheckout(req,res){
    try{
        res.render('user/checkout');
    }catch(error){
        handleError(res,error);
    }
}

module.exports = {
    httpGetCheckout,
}

