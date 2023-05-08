const productDatabase = require('../schema/product.schema');
const cloudinary = require('../config/cloudinary');

async function fetchAllProducts() {
  try {
    try {
      const products = await productDatabase.find().populate('productCategory').exec();
      return { status: true, products };
    } catch (error) {
      console.log(error);
      return { status: false, message: error.message };
    }
  } catch (error) {
    throw new Error(`Error finding products: ${error.message}`);
  }
}

async function fetchProduct(productId) {
  try {
    const product = await productDatabase.findById(productId);
    if (!product.productStatus) {
      return { status: false };
    } else {
      return { status: true, product };
    }
  } catch (error) {
    throw new Error(`Error fetching product: ${error.message}`);
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
    const result = await product.save();
    if (result) {
      return { status: true };
    } else {
      return { status: false };
    }
  } catch (error) {
    throw new Error(`Error adding products: ${error.message}`);
  }
}

async function updateProductStatus(productId) {
  try {
    const product = await productDatabase.findByIdAndUpdate(
      { _id: productId },
      { $set: { productStatus: false } },
    );
    if (product) {
      return { status: true, product };
    } else {
      return { status: false };
    }
  } catch (error) {
    throw new Error(`Error updating product: ${error.message}`);
  }
}

module.exports = {
  fetchAllProducts,
  fetchProduct,
  addNewProduct,
  updateProductStatus,
};
