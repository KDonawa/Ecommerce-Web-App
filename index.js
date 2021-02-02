const express = require('express');
const usersRepo = require('./repos/users');
const cookieSession = require('cookie-session');

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(cookieSession({keys: ['fj3fzn74jdtebx93ydb2']}));

app.get('/', (req, res) => {
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

app.post('/', async (req, res) => {
    const {email, password, passwordConfirmation} = req.body;

    // Validation
    const existingUser = await usersRepo.findOne({email: email});
    if(existingUser){
        return res.send('Email is already registerd');
    }

    if(password !== passwordConfirmation){
        return res.send('Passwords do not match');
    }

    // Authentication
    const userId = await usersRepo.insert({email, password});

    req.session.userId = userId;

    res.send('Account Created');
})


app.listen(3000, () => {
    console.log('listening');
});