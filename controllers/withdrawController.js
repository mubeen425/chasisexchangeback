const asyncHandler = require("express-async-handler");
const generateWebToken = require("../utils/token/generateToken");
const {
  userSuccessMessages,
  depositSuccessMessages,
  withdrawSuccessMessages,
} = require("../utils/responseMessages/success");
const { userErrorMessages } = require("../utils/responseMessages/error");
const {
  useErrorResponse,
  useSuccessResponse,
} = require("../utils/apiResponse/apiResponse");
const moment = require("moment");
const bcrypt = require("bcrypt");
const md5 = require("md5");

// Importing Model
const WithdrawModel = require("../models/WithdrawModel");
const UserModel = require("../models/UserModel");
const { roles, paymentMethods } = require("../utils/enums");

const withdrawRequest = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await UserModel.findOne({ email });

    console.log(email, password, "data");

    if (!userExists) {
      return useErrorResponse(res, userErrorMessages.NotFound, 422);
    }

    if (!userExists.matchPassword(password)) {
      return useErrorResponse(res, userErrorMessages.IncorrectUserData, 422);
    }

    if (userExists && (await userExists.matchPassword(password))) {
      const { amount, currency, paymentMethod } = req.body;
      console.log(amount, currency, paymentMethod);

      let payment;

      if (paymentMethod == "Online Banking") {
        payment = paymentMethods.OnlineBanking;
      } else {
        payment = paymentMethods.CryptoCurrency;
      }
      if (userExists.role === roles.REGULAR) {
        const withdraw = await WithdrawModel.create({
          userId: req.user._id,
          amount,
          currency,
          payment_method: payment,
        });
        return useSuccessResponse(
          res,
          withdrawSuccessMessages.Successfull,
          withdraw,
          200
        );
      }

      if (userExists.role === roles.ADMIN) {
        const depositList = await WithdrawModel.find({});
        const withdraw = await WithdrawModel.create({
          userId: req.user._id,
          amount,
          currency,
          payment_method: paymentMethod,
          list_deposit: depositList,
        });

        return useSuccessResponse(
          res,
          withdrawSuccessMessages.Successfull,
          withdraw,
          200
        );
      }
    }
  } catch (e) {
    return useErrorResponse(res, e.message, 422);
  }
});

module.exports = {
  withdrawRequest,
};
