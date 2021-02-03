const layout = require('../layout');

function getError(errors, param) {
    if(errors){
        const error = errors.find(x => x['param'] === param);
        if(error) return error.msg;
    }
    return '';
}

module.exports = (errors) => {
    return layout({
        content: `
        <div>
            <form method="POST">
                <input name="email" placeholder="email">
                ${getError(errors, 'email')}
                <input name="password" placeholder="password">
                ${getError(errors, 'password')}
                <button>Sign In</button>
            </form>
        </div>
        `
    });
};