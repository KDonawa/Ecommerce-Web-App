const express = require('express');
const multer = require('multer');

const { handleValidationErrors, requireAuthentication } = require('./middlewares');
const productsRepo = require('../../repos/products');
const newProductTemplate = require('../../views/admin/products/new');
const productsIndexTemplate = require('../../views/admin/products/index');
const { validateNewProductTitle, validateNewProductPrice,
} = require('./validators');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/admin/products', requireAuthentication, async (req, res) => {
    const products = await productsRepo.find({});
    res.send(productsIndexTemplate({ products }));
});

router.get('/admin/products/new', requireAuthentication, (req, res) => {
    return res.send(newProductTemplate());
});

router.post('/admin/products/new', requireAuthentication, upload.single('image'),
    [
        validateNewProductTitle,
        validateNewProductPrice,
    ],
    handleValidationErrors(newProductTemplate),
    async (req, res) => {
        const image = req.file.buffer.toString('base64');
        const { title, price } = req.body;
        await productsRepo.insert({ title, price, image });
        
        res.redirect('/admin/products');
    }
);

module.exports = router;