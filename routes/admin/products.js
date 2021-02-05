const express = require('express');
const multer = require('multer');

const { handleValidationErrors, requireAuthentication } = require('./middlewares');
const productsRepo = require('../../repos/products');
const newProductTemplate = require('../../views/admin/products/new');
const editProductTemplate = require('../../views/admin/products/edit');
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
        if(req.file){
            req.body.image = req.file.buffer.toString('base64');
        }
        await productsRepo.insert(req.body);
        
        res.redirect('/admin/products');
    }
);

router.get('/admin/products/:id/edit', requireAuthentication, async (req, res) => {
    const {id} = req.params;
    const product = await productsRepo.findById(id);
    if(!product){
        return res.send('Product not found');
    }
    return res.send(editProductTemplate(null, product));
});

router.post('/admin/products/:id/edit', requireAuthentication, upload.single('image'),
    [
        validateNewProductTitle,
        validateNewProductPrice,
    ],
    handleValidationErrors(editProductTemplate, async (req) => {
        return await productsRepo.findById(req.params.id);
    }),
    async (req, res) => {
        if(req.file){
            req.body.image = req.file.buffer.toString('base64');
        }
        try {
            await productsRepo.updateById(req.params.id, req.body);
        } catch (error) {
            return res.send('Did not find product');
        }

        res.redirect('/admin/products');
    }
);

module.exports = router;