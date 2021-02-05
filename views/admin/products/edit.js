const layout = require('../layout');
const { getValidationError} = require('../../helpers');

module.exports = (errors, {title, price}) => {
    return layout({
        content: `
        <div class="columns is-centered">
          <div class="column is-half">
            <h1 class="subtitle">Edit a Product</h1>
  
            <form action="#" method="POST" enctype="multipart/form-data">
              <div class="field">
                <label class="label">Title</label>
                <input class="input" placeholder="Title" name="title" value="${title}">
                <p class="help is-danger">${getValidationError(errors, 'title')}</p>
              </div>
              
              <div class="field">
                <label class="label">Price</label>
                <input class="input" placeholder="Price" name="price" value="${price}">
                <p class="help is-danger">${getValidationError(errors, 'price')}</p>
              </div>
              
              <div class="field">
                <label class="label">Image</label>            
                <input type="file" name="image" />
              </div>
              <br />
              <button class="button is-primary">Update</button>
            </form>
          </div>
        </div>
      `
    });
}