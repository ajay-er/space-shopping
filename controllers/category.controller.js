const { handleError } = require('../middlewares/error.handler');
const { fetchCategories, addCatogory } = require('../models/category.model');

async function httpGetCategories(req, res) {
  try {
    const response = await fetchCategories();
    if (response.status) {
      return res.render('admin/categories', { category: response.categories });
    } else {
      return res.render('admin/categories', { category: [] });
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function httpPostCategories(req, res) {
  const { name, description } = req.body;
  try {
    const response = await addCatogory(name, description);
    if (response.status) {
      res.json({ category: response.category });
    } else {
      res.json({ status:false });
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function httpDeleteCategory(req,res){
  try{
    
  }catch(error){

  }
}

module.exports = {
  httpGetCategories,
  httpPostCategories,
  httpDeleteCategory,
};
