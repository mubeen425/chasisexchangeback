const mongoose = require("mongoose");
const { currencies, paymentMethod, paymentMethods } = require("../utils/enums");
const withdrawSchema = mongoose.Schema(
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
      enum: Object.values(paymentMethods),
      // required: [true, "payment method is required"],
    },
    list_deposit: {
      type: Array,
    },
  },
  {
    timestramp: true,
  }
);
const WithdrawModel = mongoose.model("withdraw", withdrawSchema);

module.exports = WithdrawModel;
