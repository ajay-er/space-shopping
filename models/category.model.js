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

async function addCategory(name, description) {
  try {
    const category = new categoryDatabase({
      name: name,
      description: description,
      active: true,
    });
    await category.save();

    return { status: true };
  } catch (error) {
    throw new Error(`Error adding categories: ${error.message}`);
  }
}

async function updateCategory(categoryId,updateStatus) {
  try {
    const category = await categoryDatabase.updateOne({_id:categoryId},{$set:{active:updateStatus}});
    console.log('Update result:', category);
    if (category.modifiedCount > 0) {
      return { status: true };
    } else {
      return { status: false };
    }
  } catch (error) {
    throw new Error(`Error deleting categories: ${error.message}`);
  }
}

module.exports = {
  fetchCategories,
  addCategory,
  updateCategory,
};
