const couponDatabase = require('../schema/coupon.schema');

async function addCoupen(dataBody) {
  try {
    const { couponname, discount, validFrom, validUntil } = dataBody;

    const randomThreeDigitNumber = Math.floor(100 + Math.random() * 900);
    const code = `${couponname}${randomThreeDigitNumber}`.toUpperCase();
    const coupon = new couponDatabase({
      couponname: couponname,
      code: code,
      discount: discount,
      validFrom: validFrom,
      validUntil: validUntil,
    });
    const result = await coupon.save();
    if (result) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error('oops!something wrong while adding coupon');
  }
}

async function changeCouponStatus(couponId, updateStatus) {
  try {
    const result = await couponDatabase.updateOne(
      { _id: couponId },
      { $set: { isActive: updateStatus } },
    );
    if (result.modifiedCount > 0) {
      return { status: true };
    } else {
      return { status: false };
    }
  } catch (error) {
    throw new Error('oops!something wrong while changing coupon status');
  }
}

async  function getAllCoupons(){
  try {
    const result = await couponDatabase.find({}).sort({ validFrom: 1 });
    return result;   
  } catch (error) {
    throw new Error('oops!something wrong while fetching coupons');
  }
}

module.exports = { addCoupen, changeCouponStatus,getAllCoupons };
