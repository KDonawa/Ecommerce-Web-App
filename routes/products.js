const express = require('express');
const productsRepo = require('../repos/products');
const productsIndexTemplate = require('../views/products/index')

router = express.Router();

router.route('/')
    .get(async (req, res) => {
        const products = await productsRepo.find({});
        res.send(productsIndexTemplate(products));
    })

module.exports = router;