const { handleError } = require('../middlewares/error.handler');

const { fetchAllProducts,addNewProduct } = require('../models/product.model');

const { fetchCategories } = require('../models/category.model');

async function httpGetProducts(req, res) {
    try {
      const response = await fetchAllProducts();
      if (response.status) {
        return res.render('admin/products', { product: response.products });
      } else {
        return res.render('admin/products', { products: [] });
      }
    } catch (error) {
      handleError(res, error);
    }
  }
  
  async function httpGetAddProduct(req, res) {
    try {
      const response = await fetchCategories()
      return res.render('admin/add-products',{categories:response.categories});
    } catch (error) {
      handleError(res, error);
    }
  }
  
  async function httpPostAddProduct(req, res) {
    try {
      console.log("🥲🥲");
      console.log(req.body);
      const response = await addNewProduct(req.body);
      if(response.status){
         res.redirect('/admin/add-products');
      }else{
         res.status(500).json({status:false });
      }
    } catch (error) {
      handleError(res, error);
    }
  }

  module.exports = {
    httpGetProducts,
    httpGetAddProduct,
    httpPostAddProduct,
  }