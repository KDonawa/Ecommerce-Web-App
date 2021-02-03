const express = require('express');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));
app.use(cookieSession({keys: ['fj3fzn74jdtebx93ydb2']}));
app.use(authRouter);


app.listen(3000, () => {
    console.log('listening');
});