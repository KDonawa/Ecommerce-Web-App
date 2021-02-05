const Repository = require('./repo');

class ProductsRepository extends Repository {

}

module.exports = new ProductsRepository('products.json')