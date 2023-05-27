const productDatabase = require('../schema/product.schema');
const cloudinary = require('../config/cloudinary');

async function fetchAllProducts(page, limit) {
  try {
    try {
      const products = await productDatabase
        .find({ productStatus: true })
        .populate('productCategory')
        .skip((page - 1) * limit)
        .limit(limit);

      const totalProducts = await productDatabase.countDocuments();
      const totalPages = Math.ceil(totalProducts / limit);

      return {
        status: true,
        products: products,
        totalPages: totalPages,
        currentPage: page,
        limit: limit,
      };
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
    const product = await productDatabase.findById(productId).populate('productCategory');
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

async function getProductImages(productId) {
  try {
    const product = await productDatabase.findById(productId).select('productImageUrls');
    return product;
  } catch (error) {
    throw new Error(`Error fetchig product images: ${error.message}`);
  }
}

async function updateProduct(productId, productData,productImages) {
  try {
    const product = await productDatabase.findById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    if(productImages && product.productImageUrls.length < 4 && product.productImageUrls.length + productImages.length < 4 ){
      for (let i = 0; i < productImages.length; i++) {
        let locaFilePath = productImages[i].path;
        let response = await cloudinary.uploader.upload(locaFilePath, {
          folder: 'space/product_images',
          unique_filename: true,
        });
        product.productImageUrls.push(response.url);
      }
    }

    product.productName = productData.productName || product.productName;
    product.productDescription = productData.productDescription || product.productDescription;
    product.productPrice = productData.productPrice || product.productPrice;
    product.productOldPrice = productData.productOldPrice || product.productOldPrice;
    product.stocks = productData.stocks || product.stocks;
    product.productCategory = productData.productCategory || product.productCategory;

    const updatedProduct = await product.save();

    return updatedProduct;
  } catch (error) {
    throw new Error(`Error updating product details: ${error.message}`);
  }
}

module.exports = {
  fetchAllProducts,
  fetchProduct,
  addNewProduct,
  updateProductStatus,
  getProductImages,
  updateProduct,
};
