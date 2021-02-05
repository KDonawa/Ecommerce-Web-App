const layout = require('../layout');
const { getValidationError} = require('../../helpers');

module.exports = (errors) => {
    return layout({
        content: `
            <form method="POST" enctype="multipart/form-data">
                <input name="title" placeholder="Title">
                ${getValidationError(errors, 'title')}
                <input name="price" placeholder="Price">
                ${getValidationError(errors, 'price')}
                <input type="file" name="image">
                <button>Submit</button>
            </form>
        `
    });
}