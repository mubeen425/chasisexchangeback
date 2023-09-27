const asyncHandler = require("express-async-handler");
const generateWebToken = require("../utils/token/generateToken");
const {
  userSuccessMessages,
  depositSuccessMessages,
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
const DepositModel = require("../models/DepositModel");
const UserModel = require("../models/UserModel");
const { roles, paymentMethod, paymentMethods } = require("../utils/enums");

const depositRequest = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await UserModel.findOne({ email: email });

    if (!userExists) {
      return useErrorResponse(res, userErrorMessages.NotFound, 422);
    }

    if (!userExists.matchPassword(password)) {
      return useErrorResponse(res, userErrorMessages.IncorrectUserData, 422);
    }

    if (userExists && (await userExists.matchPassword(password))) {
      const { amount, currency, paymentMethod } = req.body;

      let payment;

      if (paymentMethod == "Online Banking") {
        payment = paymentMethods.OnlineBanking;
      } else {
        payment = paymentMethods.CryptoCurrency;
      }

      console.log(payment);

      if (userExists.role === roles.REGULAR) {
        const deposit = await DepositModel.create({
          userId: req.user._id,
          amount,
          currency,
          payment_method: payment,
        });
        return useSuccessResponse(
          res,
          depositSuccessMessages.Successfull,
          deposit,
          200
        );
      }

      if (userExists.role === roles.ADMIN) {
        const depositList = await DepositModel.find({});
        const deposit = await DepositModel.create({
          userId: req.user._id,
          amount,
          currency,
          payment_method: paymentMethod,
          list_deposit: depositList,
        });

        return useSuccessResponse(
          res,
          depositSuccessMessages.Successfull,
          deposit,
          200
        );
      }
    }
  } catch (e) {
    return useErrorResponse(res, e.message, 422);
  }
});

module.exports = {
  depositRequest,
};
