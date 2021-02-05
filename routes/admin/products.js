const express = require('express');
const multer = require('multer');

const {handleValidationErrors} = require('./middlewares');
const productsRepo = require('../../repos/products');
const newProductTemplate = require('../../views/admin/products/new');
const { validateNewProductTitle, validateNewProductPrice,
} = require('./validators');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/admin/products', (req, res) => {

});

router.get('/admin/products/new', (req, res) => {
    return res.send(newProductTemplate());
});

router.post('/admin/products/new', upload.single('image'),
    [
        validateNewProductTitle,
        validateNewProductPrice,
    ],
    handleValidationErrors(newProductTemplate),
    async (req, res) => {
        const image = req.file.buffer.toString('base64');
        const {title, price} = req.body;
        await productsRepo.insert({title, price, image});
        res.send('product added');
    }
);

module.exports = router;