const userDatabase = require('../schema/user.schema');

async function fetchAllUsers() {
  try {
    const users = await userDatabase.find({});
    if (users) {
      return { status: true, users };
    } else {
      return { status: false };
    }
  } catch (error) {
    throw new Error(`Error fetching users: ${error.message}`);
  }
}

async function findUserWithId(userId, action) {
  try {
    const user = await userDatabase.findById( userId );
    if (user) {
      if (action === 'block') {
        user.status = false;
      } else if (action === 'unblock') {
        user.status = true;
      }
      await user.save();

      return { status: true };
    } else {
      return { status: false };
    }
  } catch (error) {
    throw new Error(`Error finding user: ${error.message}`);
  }
}


module.exports = {
  fetchAllUsers,
  findUserWithId,

};
