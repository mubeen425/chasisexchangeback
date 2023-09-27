const mongoose = require("mongoose");
const { currencies, paymentMethod } = require("../utils/enums");
const depositSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    currency: {
      type: String,
      enum: Object.values(currencies),
      required: [true, "currency is required"],
    },
    payment_method: {
      type: String,
      //   enum: Object.values(paymentMethod),
      required: [true, "payment_method is required"],
    },
    list_deposit: {
      type: Array,
    },
  },
  {
    timestramp: true,
  }
);
const DepositModel = mongoose.model("deposit", depositSchema);

module.exports = DepositModel;
