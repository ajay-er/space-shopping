function httpGetDashBoard(req, res) {
  try {
    res.render('admin/dashboard');
  } catch (err) {
    console.log(err);
  }
}

function httpGetLogin(req,res){
    try{
        res.render('admin/login')
    }catch(err){
        console.log(err);
    }
}

function httpPostLogin(req,res){
    try{
        res.redirect('/admin');
    }catch(err){
        console.log(err);
    }
}


function httpPostLogout(req,res){
    try{
        req.session.destroy();
        res.redirect('/admin/login')
    }catch(err){
        console.log(err);
    }
}
 
module.exports = {
  httpGetDashBoard,
  httpGetLogin,
  httpPostLogin,
  httpPostLogout,
};
