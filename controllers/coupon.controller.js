const { addCoupen, changeCouponStatus, getAllCoupons } = require('../models/coupon.model');

const { handleError } = require('../middlewares/error.handler');
const { couponValidationSchema } = require('../config/joi');

async function httpGetCoupons(req, res) {
  try {
    const coupons = await getAllCoupons();
    res.render('admin/coupons', { activePage: 'coupon', coupons });
  } catch (error) {
    handleError(res, error);
  }
}

async function httpAddCoupons(req, res) {
  try {
    const validation = couponValidationSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
      return res.status(400).json({ success: false, message: validation.error.details[0].message });
    }

    const result = await addCoupen(req.body);
    if (result) {
      return res.redirect('/admin/coupons')
    } else {
      return res
        .status(500)
        .json({ success: false, message: 'oops!Something wrong internal server error' });
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function httpChangeCouponStatus(req, res) {
  try {
    const { id, status } = req.body;
    const result = await changeCouponStatus(id, status);
    if (result.status) {
      res.status(200).json({ status: true });
    } else {
      res.status(500).json({ status: false });
    }
  } catch (error) {
    handleError(res, error);
  }
}

module.exports = { httpGetCoupons, httpAddCoupons, httpChangeCouponStatus };
