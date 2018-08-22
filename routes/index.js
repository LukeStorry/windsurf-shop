/*jshint node:true, latedef:nofunc*/
"use strict";

var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var productLoader = require('./product-loader');


// GET home page
router.get('/', homepageRouterCallback);

function homepageRouterCallback(req, res, next) {
    var productList = productLoader.list;
    var settings = {
        subtitle: 'Home',
        message: "These are all our products:",
        products: productList
    };
    res.render('shop/storefront', settings);
}

// GET about page
router.get('/about', aboutRouterCallback);

function aboutRouterCallback(req, res) {
    res.render('about', { subtitle: 'About' });
}


// GET checkout page
router.get('/checkout', checkoutRouterCallback);

function checkoutRouterCallback(req, res) {
    var cart = req.session.cart;
    if (!cart || cart.items.length == 0) {
        return res.redirect('/cart');
    }
    res.render('shop/checkout', { subtitle: 'Checkout' });
}



module.exports = router;
