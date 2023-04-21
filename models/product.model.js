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

async function addNewProduct(dataBody) {
  const {
    productName,
    productDescription,
    productPrice,
    productOldPrice,
    stocks,
    productCategory,
    productImage,
  } = dataBody;

  try {
    const product = new productDatabase({
      productName: productName,
      productDescription: productDescription,
      productPrice: productPrice,
      productOldPrice: productOldPrice,
      stocks: stocks,
      productCategory: productCategory,
      productImage: productImage,
      deleteStatus: false,
    });

    const result = await product.save();
    console.log(result);
    if (result) {
      console.log("😉");
      return { status: true };
    } else {
      return { status: false };
    }
  } catch (error) {
    throw new Error(`Error adding products: ${error.message}`);
  }
}

module.exports = {
  fetchAllProducts,
  addNewProduct,
};
