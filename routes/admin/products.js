const express = require('express');
const { validationResult } = require('express-validator');
// const productsRepo = require('../../repos/products');
const newProductTemplate = require('../../views/admin/products/new');
const { validateNewProductTitle, validateNewProductPrice,

} = require('./validators');

const router = express.Router();

router.get('/admin/products', (req, res) => {

});

router.get('/admin/products/new', (req, res) => {
    return res.send(newProductTemplate());
});

router.post('/admin/products/new', [
    validateNewProductTitle,
    validateNewProductPrice,
],
    (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            console.log(result.errors);
            return res.send(newProductTemplate(result.errors));
        }
        res.send('product added');
    }
);

module.exports = router;