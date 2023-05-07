const { handleError } = require('../middlewares/error.handler');

const { fetchAllUsers, findUserWithId } = require('../models/admin.model');

async function httpGetDashBoard(req, res) {
  try {
    res.render('admin/dashboard');
  } catch (error) {
    handleError(res, error);
  }
}

async function httpGetLogin(req, res) {
  try {
    res.render('admin/login');
  } catch (error) {
    handleError(res, error);
  }
}

async function httpPostLogin(req, res) {
  try {
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      if (
        req.body.email === process.env.ADMIN_EMAIL &&
        req.body.password === process.env.ADMIN_PASSWORD
      ) {
        req.session.adminLoggedIn = true;
        return res.status(200).json({ status: true });
      } else {
        return res
          .status(400)
          .json({ status: false, error: 'Email or password is incorrect.' });
      }
    } else {
      return res.status(400).json({ error: 'Admin credentials are not set.' });
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function httpGetUsers(req, res) {
  try {
    const response = await fetchAllUsers();
    if (response.status) {
      res.render('admin/users', { users: response.users });
    } else {
      throw new Error('Failed to fetch users');
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function httpPutBlockUser(req, res) {
  const { id, action } = req.body;
  try {
    const user = await findUserWithId(id, action);
    if (!user.status) {
      return res.send({ status: 404, message: 'User not found' });
    } else {
      return res.send({
        status: 200,
        message: `User status updated.User ${action}ed succesfully.`,
      });
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function httpGetLogout(req, res) {
  try {
    req.session.destroy();
    res.redirect('/admin/login');
  } catch (error) {
    handleError(res, error);
  }
}

async function httpGet404(req, res) {
  try {
    res.render('admin/404');
  } catch (error) {
    handleError(res, error);
  }
}

module.exports = {
  httpGetDashBoard,
  httpGetLogin,
  httpPostLogin,
  httpGetUsers,
  httpPutBlockUser,

  httpGetLogout,
  httpGet404,
};
