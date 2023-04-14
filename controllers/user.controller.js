const { sendOtp, verifyOtp } = require('../config/twilio');
const {
  checkUserExistOrNot,
  verifyPhoneNumber,
  sendVerificationSignup,
  submitSignup,
} = require('../models/userAuth.model');


function httpGetHome(req, res) {
  res.status(200).render('user/home');
}


function httpGetLogin(req, res) {
  res.render('user/logins/login');
}


//otp login
function httpGetOtpLogin(req, res) {
  console.log('🫡');
  res.render('user/logins/otp-login');
}

function httpLoginVerifyPhone(req, res) {
  const { phone } = req.body;
  console.log(phone+"📞📞📞");
  checkUserExistOrNot(phone).then(async(response) => {
    console.log(response);
/*     if (response.status) {
      await sendOtp(phone);
      req.session.phone = phone;
      // return res.redirect(`/otp-verify?phone=${phone}`);
      res.json({status:true});
    } else {
      res.json({ status: false});//phone number already registerd
    } */
  });
}

function httpGetOtpVerify(req,res){
  return res.render('user/logins/otp-verify',{phone:req.query.phone});
}

function httpPostVerifyOtp(req, res) {
  verifyPhoneNumber(req.session.phone, req.body.otp).then(async (response) => {
    if (response.status) {
      req.session.userloggedIn = true;
      req.session.user = response.user;
      res.redirect('/');
    } else {
      res.redirect('/otp-verify?message=Incorrect OTP. Please try again.');
    }
  });
}


//sign up 
function httpGetSignup(req, res) {
  res.render('user/logins/signup', { message: req.flash('message') });
}


async function httpSignupOtpVerify(req, res) {
  console.log('😁😁😁');
  const { phone } = req.body;
  const phoneExist = await sendVerificationSignup(phone);
  if (!phoneExist) {
    res.send(false);
  } else {
    res.send(true);
  }
}

async function httpPostSignup(req, res) {
  const phoneVerified = await submitSignup(req.body);
  if (!phoneVerified.status) {
    return res.status(400).json({ status: false, error: phoneVerified.error });
  }
  req.session.user = phoneVerified.user;
  req.session.userloggedIn = true;
  return res.json({ status: true });
}




function httpPostLogout(req, res) {
  req.session.destroy();
  res.redirect('/');
}

function httpGet404(req, res) {
  res.status(404).render('user/404');
}

module.exports = {
  httpGetHome,
  httpGetSignup,
  httpGetLogin,
  httpGetOtpLogin,
  httpLoginVerifyPhone,
  httpGetOtpVerify,
  httpPostVerifyOtp,
  httpSignupOtpVerify,
  httpPostSignup,

  httpPostLogout,
  httpGet404,
};
