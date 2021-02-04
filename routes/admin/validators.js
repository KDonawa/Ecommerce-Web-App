const { check } = require('express-validator');
const usersRepo = require('../../repos/users');

module.exports = {
    validateSignUpEmail: check('email')
        .trim().normalizeEmail().isEmail().withMessage('Must be a valid email')
        .custom(async (email) => {
            const existingUser = await usersRepo.findOne({ email });
            if (existingUser) {
                throw new Error('Email in use');
            }
        }),
    validateSignUpPassword: check('password')
        .trim().isLength({ min: 4, max: 20 }).withMessage('Must be between 4 and 20 characters'),
    validateSignUpPasswordConfirmation: check('passwordConfirmation')
        .trim().isLength({ min: 4, max: 20 }).withMessage('Must be between 4 and 20 characters')
        .custom(async (confirmation, { req }) => {
            if (req.body.password !== confirmation) {
                throw new Error('Passwords must match');
            }
        }),
    validateSignInEmail: check('email')
        .trim().normalizeEmail().isEmail().withMessage('Must provide a valid email')
        .custom(async (email) => {
            const existingUser = await usersRepo.findOne({ email });
            if (!existingUser) {
                throw new Error('Email is not registered');
            }
        }),
    validateSignInPassword: check('password')
        .trim()
        .custom(async (password, { req }) => {
            const user = await usersRepo.findOne({ email: req.body.email });
            if(user){
                const isValidPassword = await usersRepo.comparePasswords(user.password, password);
                if (!isValidPassword) {
                    throw new Error('Passwords is incorrect');
                }
            }
        }),
    validateNewProductTitle: check('title')
        .trim().isLength({min:5, max:40}),
    validateNewProductPrice: check('price')
        .trim().toFloat().isFloat({min:1}),
};