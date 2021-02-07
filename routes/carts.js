const express = require('express');
const cartsRepo = require('../repos/carts')

const router = express.Router();

router.get('/cart', async (req, res) => {
    
    res.send('viewing cart');
})

router.post('/cart/add/:id', async (req, res) => {
    let cart;
    const id = req.params.id;
    if(!req.session.cartId){
        const cartId = await cartsRepo.insert({items:[]});
        req.session.cartId = cartId;
        cart = await cartsRepo.findById(cartId);
    } else {
        cart = await cartsRepo.findById(req.session.cartId);        
    }
    const existingItem = cart.items.find(item => item.id === id);
    if(existingItem){
        existingItem.quantity++;
    } else {
        cart.items.push({id, quantity: 1});
    }
    
    await cartsRepo.updateById(cart.id, {items: cart.items});

    res.send('Product added to cart');
})

module.exports = router;