const express = require('express');

const {handleValidationErrors} = require('./middlewares');
const usersRepo = require('../../repos/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const { validateSignUpEmail, validateSignUpPassword, validateSignUpPasswordConfirmation,
        validateSignInEmail, validateSignInPassword,
} = require('./validators');

const router = express.Router();

router.get('/signup', (req, res) => {
    res.send(signupTemplate());
});

router.post('/signup', 
    [
        validateSignUpEmail,
        validateSignUpPassword,
        validateSignUpPasswordConfirmation,
    ],
    handleValidationErrors(signupTemplate),
    async (req, res) => {
        const { email, password } = req.body;
        const userId = await usersRepo.insert({ email, password });

        req.session.userId = userId;
        res.send('Account Created');
    });

router.get('/signout', (req, res) => {
    req.session = null; // forget current session
    res.send('You are logged out');
});

router.get('/signin', (req, res) => {
    res.send(signinTemplate());
});

router.post('/signin', 
    [
        validateSignInEmail,
        validateSignInPassword,
    ],
    handleValidationErrors(signinTemplate),
    async (req, res) => {
        const { email } = req.body;
        const user = await usersRepo.findOne({ email });

        req.session.userId = user.id;
        res.send('Signed in');
    });

module.exports = router;