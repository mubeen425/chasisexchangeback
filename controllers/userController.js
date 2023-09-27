const asyncHandler = require("express-async-handler");
const generateWebToken = require("../utils/token/generateToken");
const { userSuccessMessages } = require("../utils/responseMessages/success");
const { userErrorMessages } = require("../utils/responseMessages/error");
const {
  useErrorResponse,
  useSuccessResponse,
} = require("../utils/apiResponse/apiResponse");
const moment = require("moment");
const bcrypt = require("bcrypt");
const md5 = require("md5");

// Importing Model
const UserModel = require("../models/UserModel");
const { roles } = require("../utils/enums");

const userRegister = asyncHandler(async (req, res) => {
  try {
    const { fullName, userName, email, password } = req.body;
    console.log(fullName, userName, email, password);
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return useErrorResponse(res, userErrorMessages.EmailAlreadyExists, 422);
    }

    const user = await UserModel.create({
      email,
      password,
      userName,
      fullName,
      role: roles.REGULAR,
    });

    const { isActive, isDeleted, _id, role } = user;

    return useSuccessResponse(
      res,
      userSuccessMessages.SignUp,
      {
        isActive,
        isDeleted,
        email,
        userName,
        _id,
        role,
        token: generateWebToken(user._id),
      },
      200
    );
  } catch (e) {
    console.log(e);
  }
});

const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne(
    { email, isDeleted: false },
    {
      isActive: 1,
      _id: 1,
      userName: 1,
      password: 1,
      fullName: 1,
      email: 1,
      role: 1,
    }
  );

  // User Exist or Not

  if (!user) {
    return useErrorResponse(res, userErrorMessages.NotFound, 422);
  }

  // Password is Matches or Not

  const isMatched = await user.matchPassword(password);

  if (!isMatched || !user) {
    return useErrorResponse(res, userErrorMessages.IncorrectUserData, 422);
  }
  const { isActive, isDeleted, userName, fullName, _id, role } = user;

  return useSuccessResponse(
    res,
    userSuccessMessages.Login,
    {
      _id,
      email,
      isActive,
      isDeleted,
      userName,
      fullName,
      role,
      token: generateWebToken(user._id),
    },
    200
  );
});

const userForgotPassword = asyncHandler(async (req, res) => {
  const { email, phonenumber } = req.body;

  const user = await UserModel.findOne({ email });

  // Checking If User Exist's

  if (!user) {
    return useErrorResponse(res, userErrorMessages.NotFound, 422);
  }

  const token = md5(`${user._id.toString()}${moment().valueOf()}`);

  await UserModel.updateOne(
    { email: user.email },
    {
      $set: {
        resetPasswordToken: token,
      },
    }
  );

  const url = `${process.env.PUBLIC_URL}reset-password/${token}`;
  sendEmail(user.email, url);

  return useSuccessResponse(
    res,
    userSuccessMessages.ForgotPassword,
    { url },
    200
  );
});

const userResetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return useErrorResponse(
      res,
      userErrorMessages.TokenAndPasswordNotProvided,
      422
    );
  }

  const user = await UserModel.findOne({
    resetPasswordToken: token,
    isDeleted: false,
  });

  if (!user) {
    return useErrorResponse(res, userErrorMessages.NotFound, 422);
  }

  const password = bcrypt.hashSync(newPassword, 10);
  await UserModel.updateOne(
    { resetPasswordToken: token },
    { $set: { password }, $unset: { resetPasswordToken: "" } }
  );

  return useSuccessResponse(
    res,
    userSuccessMessages.PasswordResetSuccessfull,
    {},
    200
  );
});

const userPasswordChange = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await UserModel.find({ _id: req.user._id });

  const validPassword = await bcrypt.compare(oldPassword, user[0].password);

  if (!validPassword) {
    useErrorResponse(res, userErrorMessages.IncorrectPassword, 400);
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedPassword;

  await UserModel.findByIdAndUpdate(req.user._id, {
    $set: {
      password: hashedPassword,
    },
  });

  return useSuccessResponse(res, userSuccessMessages.PasswordChanged, {}, 200);
});

module.exports = {
  userRegister,
  userLogin,
  userForgotPassword,
  userResetPassword,
  userPasswordChange,
};
