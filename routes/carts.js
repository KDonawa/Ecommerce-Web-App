const express = require('express');
const cartsRepo = require('../repos/carts');
const productsRepo = require('../repos/products');
const cartDisplayTemplate = require('../views/cart/display');

const router = express.Router();

router.get('/cart', async (req, res) => {
    if(!req.session.cartId){
        return res.redirect('/');
    }
    const cart = await cartsRepo.findById(req.session.cartId);
    for (const item of cart.items) {
        const product = await productsRepo.findById(item.id);
        item.product = product;
    }
    res.send(cartDisplayTemplate(cart.items));
})

router.post('/cart/add/:id', async (req, res) => {
    let cart;
    const {id} = req.params;
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

    res.redirect('/');
})

router.post('/cart/delete/:id', async (req, res) => {
    const {id} = req.params;
    const cart = await cartsRepo.findById(req.session.cartId);
    const items = cart.items.filter(item => item.id !== id);
    await cartsRepo.updateById(req.session.cartId, {items})
    res.redirect('/cart');
})

module.exports = router;