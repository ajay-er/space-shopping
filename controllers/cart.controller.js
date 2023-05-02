const { handleError } = require('../middlewares/error.handler');

const { addItemToCart } = require('../models/cart.model');

async function httpGetCart(req, res) {
  try {
    res.render('user/cart');
  } catch (error) {
    handleError(res, error);
  }
}

async function httpPostToCart(req, res) {
  try {
    const { productId, quantity } = req.body;
    const userId = req.session.user._id;

    if (!productId || typeof productId !== 'string') {
      return res
        .status(400)
        .json({ status: false, message: 'Invalid product id' });
    }
    if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
      return res
        .status(400)
        .json({ status: false, message: 'Invalid quantity' });
    }
    const cartResult = await addItemToCart(userId, productId, quantity);
    if (cartResult.status) {
      res.status(200).json({ status: cartResult.status, message: cartResult.message });
    } else {
      res.status(404).json({ status: cartResult.status, message: cartResult.message });
    }
  } catch (error) {
    handleError(res, error);
  }
}

module.exports = {
  httpGetCart,
  httpPostToCart,
};
