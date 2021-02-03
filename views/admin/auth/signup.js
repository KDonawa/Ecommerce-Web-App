const layout = require('../layout');

function getError(errors, param) {
    if(errors){
        const error = errors.find(x => x['param'] === param);
        if(error) return error.msg;
    }
    return '';
}
module.exports = ({req, errors}) => {
    return layout({
        content: `
        <div>
            Your id is: ${req.session.userId}
            <form method="POST">
                <input name="email" placeholder="email">
                ${getError(errors, 'email')}
                <input name="password" placeholder="password">
                ${getError(errors, 'password')}
                <input name="passwordConfirmation" placeholder="password confirmation">
                ${getError(errors, 'passwordConfirmation')}
                <button>Sign Up</button>
            </form>
        </div>
        `
    });
};