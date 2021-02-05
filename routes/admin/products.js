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

router.post('/admin/products/new',
    [
        validateNewProductTitle,
        validateNewProductPrice,
    ],
    upload.single('image'),
    (req, res) => {
        const result = validationResult(req);
        const {fieldname, originalname} = req.file;
        console.log(fieldname, originalname);
        if (!result.isEmpty()) {
            //console.log(result.errors);
            return res.send(newProductTemplate(result.errors));
        }

        res.send('product added');
    }
);

module.exports = router;