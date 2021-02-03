const express = require('express');
const usersRepo = require('./repos/users');
const cookieSession = require('cookie-session');

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(cookieSession({keys: ['fj3fzn74jdtebx93ydb2']}));

app.get('/signup', (req, res) => {
    res.send(`
        <div>
            <form method="POST">
                <input name="email" placeholder="email">
                <input name="password" placeholder="password">
                <input name="passwordConfirmation" placeholder="password confirmation">
                <button>Sign Up</button>
            </form>
        </div>
    `);
});

app.post('/signup', async (req, res) => {
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

app.get('/signout', (req, res) => {
    req.session = null; // forget current session
    res.send('You are logged out');
});

app.get('/signin', (req, res) => {
    res.send(`
        <div>
            <form method="POST">
                <input name="email" placeholder="email">
                <input name="password" placeholder="password">
                <button>Sign In</button>
            </form>
        </div>
    `);
});

app.post('/signin', async (req, res) => {
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
})

app.listen(3000, () => {
    console.log('listening');
});