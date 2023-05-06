const { handleError } = require('../middlewares/error.handler');

const {
  addItemToCart,
  removeItemFromCart,
  fetchCartProducts,
  clearCartItems,
  updateCartDetails,
} = require('../models/cart.model');

async function httpGetCart(req, res) {
  try {
    const userId = req.session.user._id;

    const cartResult = await fetchCartProducts(userId);

    if (cartResult.status) {
      const items = cartResult.cart.items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
      }));

      return res.render('user/cart', { items, total: cartResult.total });
    } else {
      return res.render('user/cart', { items: [], total: 0 });
    }
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
        .json({ success: false, message: 'Invalid product id' });
    }
    if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid quantity' });
    }
    const cartResult = await addItemToCart(userId, productId, quantity);
    if (cartResult.status) {
      res
        .status(200)
        .json({ success: cartResult.status, message: cartResult.message ,product:cartResult.productData });
    } else {
      res
        .status(404)
        .json({ success: cartResult.status, message: cartResult.message,product: [] });
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function httpRemoveFromCart(req, res) {
  try {
    const { productId } = req.body;
    const userId = req.session.user._id;
    if (!productId || typeof productId !== 'string') {
      return res
        .status(400)
        .json({ status: false, message: 'Invalid product id' });
    }

    const cartResult = await removeItemFromCart(userId, productId);
    if (cartResult.status) {
      res
        .status(200)
        .json({ status: cartResult.status, message: cartResult.message ,total:cartResult.total });
    } else {
      res
        .status(404)
        .json({ status: cartResult.status, message: cartResult.message });
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function httpClearCart(req, res) {
  try {
    const cartResult = await clearCartItems(req.session.user._id);
    if (cartResult.status) {
      return res.json({ success: true, message: cartResult.message });
    } else {
      return res.json({ success: false, message: cartResult.message });
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function httpUpdateQuantity(req, res) {
  try {
    const { quantity, productId } = req.body;
    const userId = req.session.user._id;

    const cartResult = await updateCartDetails(quantity, productId, userId);

    if (cartResult.status) {
      return res.json({
        success: true,
        message: cartResult.message,
        total: cartResult.total,
      });
    } else {
      return res.json({ success: false, message: cartResult.message });
    }
  } catch (error) {
    handleError(res, error);
  }
}

module.exports = {
  httpGetCart,
  httpPostToCart,
  httpRemoveFromCart,
  httpClearCart,
  httpUpdateQuantity,
};
