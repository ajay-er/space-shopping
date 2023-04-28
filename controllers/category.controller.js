const { handleError } = require('../middlewares/error.handler');

const {
  fetchCategories,
  addCategory,
  updateCategory,
} = require('../models/category.model');


async function httpGetCategories(req, res) {
  try {
    const response = await fetchCategories();
    if (response.status) {
      res.render('admin/categories', { category: response.categories });
    } else {
      res.render('admin/categories', { category: [] });
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function httpPostCategories(req, res) {
  const { name } = req.body;
  try {
    const response = await addCategory(name);
    if (response.status) {
      res.json({ status: true,message:response.message });
    } else {
      res.json({ status: false ,message: response.message});
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function httpPutCategory(req, res) {
  const  {id,status}  = req.body;
  try {
    const response = await updateCategory(id,status);
    if(response.status){
      res.status(200).json({status:true});
    }else{
      res.status(400).json({status:false});
    }
  } catch (error) {
    handleError(res,error);
  }
}

module.exports = {
  httpGetCategories,
  httpPostCategories,
  httpPutCategory,
};
