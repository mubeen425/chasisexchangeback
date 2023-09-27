const express = require('express');
const route = express.Router();

// Controllers
const {
    withdrawRequest
} = require('../controllers/withdrawController');
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
route.post('/withdraw', validateUserSignUp, protectRoute, withdrawRequest);





module.exports = route;
