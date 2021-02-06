const express = require('express');
const cartsRepo = require('../repos/carts')

const router = express.Router();

router.get('/cart', async (req, res) => {
    
    res.send('viewing cart');
})

router.post('/cart/add/:id', async (req, res) => {
    let cart;
    if(!req.session.cartId){
        const cartId = await cartsRepo.insert({items:[]});
        req.session.cartId = cartId;
        cart = await cartsRepo.findById(cartId);
    } else {
        cart = await cartsRepo.findById(req.session.cartId);
    }
    console.log(cart);
    res.send('Product added to cart');
})

module.exports = router;