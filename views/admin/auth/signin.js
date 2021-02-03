const layout = require('../layout');
const {getValidationError} = require('../../helpers');

module.exports = (errors) => {
    return layout({
        content: `
        <div>
            <form method="POST">
                <input name="email" placeholder="email">
                ${getValidationError(errors, 'email')}
                <input name="password" placeholder="password">
                ${getValidationError(errors, 'password')}
                <button>Sign In</button>
            </form>
        </div>
        `
    });
};