const userDatabase = require('./user.schema');
const { sendOtp, verifyOtp } = require('../config/twilio');

async function isPhoneNumberExist(phoneNumber) {
  let user = await userDatabase.findOne({ phone: phoneNumber });
  if (user) {
    await sendOtp(phoneNumber); 
    return true;
  }else{
    return false;
  }
}

async function checkOTPcorrectOrNot(phoneNumber,otp){
  let checkOtp = await verifyOtp(phoneNumber,otp)
  if(checkOtp){
    let user = await userDatabase.findOne({ phone: phoneNumber });
    return {user,status:true};
  }else{
    return false;
  }
}

module.exports = {
    isPhoneNumberExist,
    checkOTPcorrectOrNot,
}