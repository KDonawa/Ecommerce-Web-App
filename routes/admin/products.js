const express = require('express');
const { validationResult } = require('express-validator');
const multer = require('multer');
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
    async (req, res) => {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            //console.log(result.errors);
            return res.send(newProductTemplate(result.errors));
        }

        const image = req.file.buffer.toString('base64');
        const {title, price} = req.body;
        await productsRepo.insert({title, price, image});
        res.send('product added');
    }
);

module.exports = router;