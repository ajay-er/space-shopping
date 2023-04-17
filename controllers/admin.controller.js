const { handleError } = require('../middlewares/error.handler');

function httpGetDashBoard(req, res) {
  try {
    res.render('admin/dashboard');
  } catch (error) {
    handleError(res,error);
}
}

function httpGetLogin(req,res){
    try{
        res.render('admin/login')
    }catch(error){
        handleError(res,error);
    }
}

function httpPostLogin(req, res) {
    try {
        if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
            console.log(req.body.email +""+req.body.password);
            if (req.body.email === process.env.ADMIN_EMAIL && req.body.password === process.env.ADMIN_PASSWORD) {
                req.session.adminLoggedIn = true;
                return res.status(200).json({status: true});
            } else {
                return res.status(400).json({status: true,error: 'Email or password is incorrect.'});
            }
        } else {
            return res.status(400).json({error: 'Admin credentials are not set.'});
        }
    } catch (error) {
        handleError(res, error);
    }
}


function httpPostLogout(req,res){
    try{
        req.session.destroy();
        res.redirect('/admin/login')
    }catch(error){
        handleError(res,error);
    }
}


module.exports = {
  httpGetDashBoard,
  httpGetLogin,
  httpPostLogin,
  httpPostLogout,
};
