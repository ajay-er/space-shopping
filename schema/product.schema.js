const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productDescription: {
      type: String,
      required: true,
    },
    productCategory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
      },
    ],
    productPrice: {
      type: Number,
      required: true,
    },
    productOldPrice: {
      type: Number,
      default: null,
    },
    stocks:{
      type:Number,
      required:true,
    },
    productImageUrls: {
      type: [String],
    },
    deleteStatus: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
