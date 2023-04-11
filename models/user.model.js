const userDatabase = require('./user.schema');
const { sendOtp, verifyOtp } = require('../config/twilio');

async function sendVerificationCode(phoneNumber) {
  const user = await userDatabase.findOne({ phone: phoneNumber });
  if (user) {
    await sendOtp(phoneNumber);
    return true;
  } else {
    return false;
  }
}

async function verifyPhoneNumber(phoneNumber, otp) {
  const isVerified = await verifyOtp(phoneNumber, otp);
  if (isVerified) {
    const user = await userDatabase.findOne({ phone: phoneNumber });
    return { user, status: true };
  } else {
    return { status: false };
  }
}

async function sendVerificationSignup(phoneNumber) {
  const user = await userDatabase.findOne({ phone: phoneNumber });
  if (!user) {
     await sendOtp(phoneNumber);
    return true;
  } else {
    return false;
  }
}

async function submitSignup(userData){
  const { username,email,phone,password,otp} = userData;
  const isVerified = await verifyOtp(phone, otp);
  if(isVerified){
    let user = new userDatabase({
        name : username,
        email: email,
        phone: phone,
        password: password,
        status:true,
    });

    try {
      await user.save();
      console.log("User saved successfully!");
    } catch (error) {
      console.error("Error saving user:", error);
    }
    return true;
  }else{
    return false;
  }

}

module.exports = {
  sendVerificationCode,
  verifyPhoneNumber,
  sendVerificationSignup,
  submitSignup,
  
};
