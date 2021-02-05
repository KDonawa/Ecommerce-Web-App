const layout = require('../layout');
const {getValidationError} = require('../../helpers');

module.exports = (errors) => {
    return layout({
      content: `
        <div class="container">
          <div class="columns is-centered">
            <div class="column is-one-quarter">
              <form action="#" method="POST">
                <h1 class="title">Sign in</h1>
                <div class="field">
                  <label class="label">Email</label>
                  <input required class="input" placeholder="Email" name="email" />
                  <p class="help is-danger">${getValidationError(errors, 'email')}</p>
                </div>
                <div class="field">
                  <label class="label">Password</label>
                  <input required class="input" placeholder="Password" name="password" type="password" />
                  <p class="help is-danger">${getValidationError(errors, 'password')}</p>
                </div>
                <button class="button is-primary">Submit</button>
              </form>
              <a href="/signup">Need an account? Sign Up</a>
            </div>
          </div>
        </div>
      `
    });
  };