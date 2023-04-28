const { handleError } = require('../middlewares/error.handler');

const { fetchCategories } = require('../models/category.model');

const {
  fetchAllProducts,
  fetchProduct,
  addNewProduct,
  updateProductStatus,
} = require('../models/product.model');

async function httpGetProducts(req, res) {
  try {
    const productsResult = await fetchAllProducts();
    const categoryResult = await fetchCategories();
    if (productsResult.status) {
      return res.render('admin/products', {
        product: productsResult.products,
        categories: categoryResult.categories,
      });
    } else {
      return res.render('admin/products', { product: [], categories: [] });
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function httpGetAddProduct(req, res) {
  try {
    const categoryResult = await fetchCategories();
    return res.render('admin/add-products', {
      categories: categoryResult.categories,
    });
  } catch (error) {
    handleError(res, error);
  }
}

async function httpPostAddProduct(req, res) {
  try {
    const productResult = await addNewProduct(req.body, req.files);
    if (productResult.status) {
      res
        .status(200)
        .json({ success: true, message: 'Product added succesfully' });
    } else {
      res
        .status(500)
        .json({ status: false, message: 'Failed to add product.' });
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function httpGetEditProduct(req, res) {
  try {
    const productId = req.params.id;
    const productResult = await fetchProduct(productId);
    const categoryResult = await fetchCategories();

    if (productResult.status) {
      res.render('admin/update-products', {
        categories: categoryResult.categories,
        product: productResult.product,
      });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function httpPutProduct(req, res) {
  try {
    const productId = req.params.id;
    const productResult = await updateProductStatus(productId);

    if (productResult.status) {
      res
        .status(200)
        .json({ success: true, message: 'Product deleted succesfully' });
    } else {
      res
        .status(500)
        .json({ status: false, message: 'Failed to delete product.' });
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function httpPutProductDetails(req, res) {
  try {
    console.log(req.body.data);
  } catch (error) {
    handleError(res, error);
  }
}

async function httpGetProductpage(req,res){
  try{
    res.render('user/product');
  }catch(error){
    handleError(res, error);
  }
}

module.exports = {
  httpGetProducts,
  httpGetAddProduct,
  httpPostAddProduct,
  httpGetEditProduct,
  httpPutProduct,
  httpPutProductDetails,
  httpGetProductpage,
};
