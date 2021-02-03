const { check, validationResult } = require('express-validator');
const usersRepo = require('../../repos/users');

module.exports = {
    validateEmail: check('email')
        .trim().normalizeEmail().isEmail().withMessage('Must be a valid email')
        .custom(async (email) => {
            const existingUser = await usersRepo.findOne({ email });
            if (existingUser) {
                throw new Error('Email in use');
            }
        }),
    validatePassword: check('password')
        .trim().isLength({ min: 4, max: 20 }).withMessage('Must be between 4 and 20 characters'),
    validatePasswordConfirmation: check('passwordConfirmation')
        .trim().isLength({ min: 4, max: 20 }).withMessage('Must be between 4 and 20 characters')
        .custom(async (confirmation, { req }) => {
            if (req.body.password !== confirmation) {
                throw new Error('Passwords must match');
            }
        }),
};