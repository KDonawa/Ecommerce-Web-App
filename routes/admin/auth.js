const express = require('express');
const usersRepo = require('../../repos/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

const router = express.Router();

router.get('/signup', (req, res) => {
    res.send(signupTemplate({req}));
});

router.post('/signup', async (req, res) => {
    const {email, password, passwordConfirmation} = req.body;

    // Validation
    const existingUser = await usersRepo.findOne({email: email});
    if(existingUser){
        return res.send('Email is already registerd');
    }

    if(password !== passwordConfirmation){
        return res.send('Passwords do not match');
    }

    const userId = await usersRepo.insert({email, password});

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

router.post('/signin', async (req, res) => {
    const {email, password} = req.body;

    const user = await usersRepo.findOne({email});
    if(!user) {
        return res.send('Email is not registered');
    }
    const isValidPassword = await usersRepo.comparePasswords(user.password, password);
    if(!isValidPassword) {
        return res.send('Invalid password');
    }

    req.session.userId = user.id;
    res.send('Signed in');
});

module.exports = router;