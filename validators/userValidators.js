const { oneOf, body } = require('express-validator');

const validateUserSignUp = [
    body('email', 'Invalid Email').isEmail().normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password should be at least 6 characters')
]

const validateLoginUser = [
    body('email', 'Invalid Email').isEmail().normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password should be at least 6 characters'),
];

const valdiateForgotEmail = [
    oneOf([
        body('email').isEmail().normalizeEmail(),
        body('contact').exists(),
    ])
];

const validateResetPassword = [
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('Password should be at least 6 characters'),
];



module.exports = {
    validateUserSignUp,
    validateLoginUser,
    valdiateForgotEmail,
    validateResetPassword,
};
