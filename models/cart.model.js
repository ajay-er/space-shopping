const cartDatabase = require('../schema/cart.schema');
const productDatabase = require('../schema/product.schema');
const userDatabase = require('../schema/user.schema');

async function addItemToCart(userId, productId, quantity) {
  try {
    const product = await productDatabase
      .findById(productId)
      .select('productPrice');

    if (!product) {
      return { status: false, message: 'product not found' };
    }

    let cart = await cartDatabase.findOne({ user: userId });
    if (cart) {
      // If cart already exists, check if the product is already in the cart
      const itemIndex = cart.items.findIndex((item) =>
        item.product.equals(productId)
      );
      if (itemIndex > -1) {
        // If product already in cart, update its quantity and price
        cart.items[itemIndex].quantity += quantity;
        cart.items[itemIndex].price =
          product.productPrice * cart.items[itemIndex].quantity;
      } else {
        // If product not in cart, add new item to the items array
        cart.items.push({
          product: productId,
          quantity,
          price: product.productPrice * quantity,
        });
      }
      cart.total = cart.items.reduce((acc, item) => acc + item.price, 0);
      await cart.save();
      return {
        status: true,
        message: 'product added to cart',
      };
    }

    // If cart doesn't exist, create a new cart and add the product
    const newCart = await cartDatabase.create({
      user: userId,
      items: [
        {
          product: productId,
          quantity,
          price: product.productPrice * quantity,
        },
      ],
    });
    await userDatabase.findByIdAndUpdate(userId, { cart: newCart._id });
    return { status: true, message: 'product added to cart' };
  } catch (error) {
    throw new Error('Something wrong while adding product');
  }
}




module.exports = {
  addItemToCart,
};
