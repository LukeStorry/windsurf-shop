/*jshint node:true, latedef:nofunc*/
"use strict";

var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var csrf = require('csurf');
var productLoader = require('./product-loader');

// protect all routes in this file with csrf protection
router.use(csrf());


// GET /cart/
router.get('/', cartRouterCallback);
function cartRouterCallback(req, res, next) {
    res.render('shop/cart', { subtitle: "Cart" });
}

// add item to cart by id, with a GET /cart/add/#####
router.get('/add/:id', addToCartCallback);
function addToCartCallback(req, res, next) {
    var cart = req.session.cart;
    if (!cart) {
        cart = {
            totalQuantity: 0,
            totalPrice: 0,
            items: []
        };
    }
    var cartItem = cart.items.find(function (item) { return item.product.id == req.params.id; });
    if (!cartItem) {
      var productList = productLoader.list;
        var product = productList.find(function (product) { return product.id == req.params.id; });
        if (!product) {
            console.log("Product ID not in products list");
            return res.redirect('/');
        }
        cartItem = {
            product: product,
            quantity: 0,
            subtotal: 0
        };
        cart.items.push(cartItem);
    }
    cartItem.quantity += 1;
    cartItem.subtotal += cartItem.product.price;

    updateCartTotals(cart);
    req.session.cart = cart;
    res.redirect('/cart');
}

// reduce items in cart by id, with a GET /cart/reduce/#####
router.get('/reduce/:id', reduceCartCallback);
function reduceCartCallback(req, res, next) {
    var cart = req.session.cart;
    if (!cart) {
        console.log("No Cart found.");
        return res.redirect('/');
    }
    var cartItem = cart.items.find(function (item) { return item.product.id == req.params.id; });
    if (!cartItem) {
        console.log("Item not found.");
        return;
    }
    if (cartItem.quantity > 1) {
        cartItem.quantity -= 1;
        cartItem.subtotal -= cartItem.product.price;
    } else {
        var index = cart.items.indexOf(cartItem);
        cart.items.splice(index, 1);
    }

    updateCartTotals(cart);
    req.session.cart = cart;
    //console.log('Cart: ',cart);
    res.redirect('/cart');
}

// increase items in cart by id, with a GET /cart/increase/#####
router.get('/increase/:id', increaseCartCallback);
function increaseCartCallback(req, res, next) {
    var cart = req.session.cart;
    if (!cart) {
        console.log("No Cart found.");
        return res.redirect('/');
    }
    var cartItem = cart.items.find(function (item) { return item.product.id == req.params.id; });
    if (!cartItem) {
        console.log("Item not found.");
        return;
    }
    cartItem.quantity += 1;
    cartItem.subtotal += cartItem.product.price;

    updateCartTotals(cart);
    req.session.cart = cart;
    //console.log('Cart: ',cart);
    res.redirect('/cart');
}


// reusable method to loop through and update cart total quantity and price
function updateCartTotals(cart) {
    var quantityReducer = function (total, cartItem) { return total + cartItem.quantity; };
    cart.totalQuantity = cart.items.reduce(quantityReducer, 0);
    var priceReducer = function (total, cartItem) { return total + cartItem.subtotal; };
    cart.totalPrice = cart.items.reduce(priceReducer, 0);
}



module.exports = router;
