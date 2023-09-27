const express = require('express');
const route = express.Router();

// Controllers
const {
    depositRequest
} = require('../controllers/depositController.js');
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
route.post('/deposit', validateUserSignUp, protectRoute, depositRequest);





module.exports = route;
