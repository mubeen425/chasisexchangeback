const express = require('express');
const route = express.Router();

// Controllers
const {
    userRegister,
    userLogin,
} = require('../controllers/userController');
//Validation
const {
    validateUserSignUp, validateLoginUser,
} = require('../validators/userValidators');

// check validation middleware
const {
    checkValidationMiddleware,
} = require('../middleware/validationMiddleware');
const { protectRoute, protectVerificationRoute, isAdmin, isSuperAdmin } = require('../middleware/authMiddleware');

// User Routes
route.post('/login', validateLoginUser, checkValidationMiddleware, userLogin);
route.post('/signup', validateUserSignUp, checkValidationMiddleware, userRegister);




module.exports = route;
