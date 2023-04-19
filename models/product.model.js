const productDatabase = require('../schema/product.schema');

async function fetchAllProducts() {
  try {
    const products = await productDatabase.find({});
    if (products) {
      return { status: true, products };
    } else {
      return { status: false };
    }
  } catch (error) {
    throw new Error(`Error finding products: ${error.message}`);
  }
}

module.exports = {
  fetchAllProducts,
};
