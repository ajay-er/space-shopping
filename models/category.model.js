const categoryDatabase = require('../schema/category.schema');

async function fetchCategories() {
  try {
    const categories = await categoryDatabase.find({});
    if (categories) {
      return { status: true, categories };
    } else {
      return { status: false };
    }
  } catch (error) {
    throw new Error(`Error finding categories: ${error.message}`);
  }
}

async function addCatogory(name, description) {
  try {
    const category = new categoryDatabase({
      name: name,
      description: description,
      active:true,
    });
    await category.save();
    
    return { status: true };
  } catch (error) {
    throw new Error(`Error adding categories: ${error.message}`);
  }
}

module.exports = {
  fetchCategories,
  addCatogory,
};
