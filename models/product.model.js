const productDatabase = require('../schema/product.schema');
const cloudinary = require('../config/cloudinary');

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

async function addNewProduct(dataBody, dataFiles) {
  const {
    productName,
    productDescription,
    productPrice,
    productOldPrice,
    stocks,
    productCategory,
  } = dataBody;

  const product = new productDatabase({
    productName: productName,
    productDescription: productDescription,
    productPrice: productPrice,
    productOldPrice: productOldPrice,
    stocks: stocks,
    productCategory: productCategory,
    deleteStatus: false,
  });

  try {
    const imageUrlList = [];

    for (let i = 0; i < dataFiles.length; i++) {
      let locaFilePath = dataFiles[i].path;
      let response = await cloudinary.uploader.upload(locaFilePath, {
        folder: 'space/product_images',
        unique_filename: true,
      });
      imageUrlList.push(response.url);
    }

    product.productImageUrls = imageUrlList;
    console.log('😉');
    console.log(imageUrlList);
    console.log('😉');

    const result = await product.save();
    console.log(result);
    if (result) {
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
