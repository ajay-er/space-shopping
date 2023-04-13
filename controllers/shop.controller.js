const {
  sendVerificationCode,
  verifyPhoneNumber,
  sendVerificationSignup,
  submitSignup,


} = require('../models/user.model');

function httpGetHome(req, res) {
  res.status(200).render('shop/home');
}

function httpGetSignup(req, res) {
  res.render('shop/logins/signup',{ message: req.flash('message') });
}

function httpGetLogin(req, res) {
  res.render('shop/logins/login');
}

function httpGetOTP(req, res) { 
  res.render('shop/logins/otp-login');
}

function httpVerifyPhone(req, res) {
  const { phone } = req.body;
  sendVerificationCode(phone).then((response) => {
    if (response) {
      req.session.phone = phone;
      return res.render('shop/logins/otp-verify', { phone });
    } else {
      let message = 'Phone number not registered';
      return res.redirect('/otp-login?message=' + message);
    }
  });
} 

function httpPostVerifyOTP(req, res) {
  verifyPhoneNumber(req.session.phone, req.body.otp).then(
    async (response) => {
      if (response.status) {
        req.session.loggedIn = true;
        req.session.user = response.user;
        res.redirect('/');
      } else {
        res.redirect('/otp-verify?message=Incorrect OTP. Please try again.');
      }
    }
  );
}


async function httpSignUpOtpVerify(req, res) {
  console.log('😁😁😁');
  const { phone} = req.body;
  const phoneExist = await sendVerificationSignup(phone);
  if (!phoneExist) {
    res.send(false);
  }else{
    res.send(true);
  }
  
}


async function httpPostSignUp(req, res) {
  const phoneVerified = await submitSignup(req.body);
  if (!phoneVerified.status) {
    req.flash('message', 'Phone number already registered');
    return  res.redirect('/signup');

  }

  req.session.user = phoneVerified.user;
  req.session.loggedIn = true;
  return res.redirect('/');
}


function httpPostLogout(req, res) {
  req.session.destroy();
  res.redirect('/');
}

function httpGet404(req, res) {
  res.status(404).render('shop/404');
}

module.exports = {
  httpGetHome,
  httpGetSignup,
  httpGetLogin,
  httpGetOTP,
  httpVerifyPhone,
  httpPostVerifyOTP,
  httpSignUpOtpVerify,
  httpPostSignUp,

  httpPostLogout,
  httpGet404,
};
