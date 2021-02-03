const layout = require('../layout');
const {getValidationError} = require('../../helpers');

module.exports = (req, errors) => {
    return layout({
        content: `
        <div>
            Your id is: ${req.session.userId}
            <form method="POST">
                <input name="email" placeholder="email">
                ${getValidationError(errors, 'email')}
                <input name="password" placeholder="password">
                ${getValidationError(errors, 'password')}
                <input name="passwordConfirmation" placeholder="password confirmation">
                ${getValidationError(errors, 'passwordConfirmation')}
                <button>Sign Up</button>
            </form>
        </div>
        `
    });
};