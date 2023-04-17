const {
  checkUserWithEmail,
  checkUserExistOrNot,
  verifyPhoneNumber,
  sendVerificationSignup,
  submitSignup,
} = require('../models/userAuth.model');

const { handleError } = require('../middlewares/error.handler');
const validateSignup = require('../config/joi');

function httpGetHome(req, res) {
  try {
    res.status(200).render('user/home');
  } catch (error) {
    handleError(res, error);
  }
}

async function httpGetLogin(req, res) {
  try {
    res.render('user/logins/login');
  } catch (error) {
    handleError(res, error);
  }
}

async function httpPostLoginVerify(req, res) {
  const { email, password } = req.body;
  console.log(email,password);
  try {
    const user = await checkUserWithEmail(email, password);
    if (user.status) {
      req.session.userloggedIn = true;
      req.session.user = user;
      res.status(200).json({ status: true, message: 'Login successful!' });
    } else {
      res
        .status(200)
        .json({ status: false, message: user.message });
    }
  } catch (error) {
    handleError(res, error);
  }
}

//otp login
function httpGetOtpLogin(req, res) {
  try {
    res.render('user/logins/otp-login');
  } catch (error) {
    handleError(res, error);
  }
}

async function httpLoginVerifyPhone(req, res) {
  const { phone } = req.body;
  console.log(phone + '📞');
  try {
    const userExists = await checkUserExistOrNot(phone);
    if (userExists) {
      req.session.phone = phone;
      res.status(200).json({ status: true });
    } else {
      res.status(400).json({ status: false }); //phone number already registered
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function httpGetOtpVerify(req, res) {
  try {
    const phone = req.session.phone;
    return res.render('user/logins/otp-verify', { phone });
  } catch (error) {
    handleError(res, error);
  }
}

async function httpPostVerifyOtp(req, res) {
  try {
    const phone = req.session.phone;
    const { otp } = req.body;
    const response = await verifyPhoneNumber(phone, otp);
    if (response.status) {
      req.session.userloggedIn = true;
      req.session.user = response.user;
      return res.json({ status: true });
    } else {
      return res.json({ status: false });
    }
  } catch (error) {
    handleError(res, error);
  }
}

//sign up
async function httpGetSignup(req, res) {
  try {
    res.render('user/logins/signup');
  } catch (error) {
    handleError(res, error);
  }
}

async function httpSignupOtpVerify(req, res) {
  try {
    const { phone } = req.body;
    const phoneExist = await sendVerificationSignup(phone);
    if (!phoneExist) {
      res.send(false);
    } else {
      res.send(true);
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function httpPostSignup(req, res) {
  try {
    const validation = await validateSignup(req.body);

    if (validation.error) {
      return res
        .status(400)
        .json({ error: validation.error.details[0].message });
    }

    const { status, user, message } = await submitSignup(req.body);

    if (!status) {
      return res.status(400).json({ error: message, status });
    }
    req.session.user = user;
    req.session.userloggedIn = true;

    return res.json({ status: true });
  } catch (error) {
    handleError(res, error);
  }
}

function httpGetAccount(req,res){
  try{
    const user = req.session.user;
    res.render('user/account',{user});
    
  }catch(error){
    handleError(res,error);
  }
}

function httpGetLogout(req, res) {
  try {
    req.session.destroy();
    res.redirect('/');
  } catch (error) {
    handleError(res, error);
  }
}

function httpGet404(req, res) {
  try {
    res.status(404).render('user/404');
  } catch (error) {
    handleError(res, error);
  }
}

module.exports = {
  httpGetHome,
  httpGetSignup,
  httpGetLogin,
  httpPostLoginVerify,
  httpGetOtpLogin,
  httpLoginVerifyPhone,
  httpGetOtpVerify,
  httpPostVerifyOtp,
  httpSignupOtpVerify,
  httpPostSignup,

  httpGetAccount,
  httpGetLogout,
  httpGet404,
};
