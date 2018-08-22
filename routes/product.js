/*jshint node:true, latedef:nofunc*/
"use strict";

var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var csrf = require('csurf');
var productLoader = require('./product-loader');

// protect all routes in this file with csrf protection
router.use(csrf());


// GET form action to /product/search/ with input 's'
router.get('/search/', searchCallback);
// not a great search funciton, just checks if each product description/name has the search terms as substrings.
function searchCallback(req, res, next) {
    var searchString = req.query.s;
    if (!searchString) {
        return res.redirect('/');
    }
    var productList = productLoader.list;
    var searchTerms = searchString.toLowerCase().split(' ', 6);
    var searchResults = [];
    for (var productIndex = 0; productIndex < productList.length; productIndex++) {
        var match = true;
        var matchesName, matchesDescription;
        for (var termIndex = 0; termIndex < searchTerms.length; termIndex++) {
            matchesName = productList[productIndex].name.toLowerCase().indexOf(searchTerms[termIndex]) != -1;
            matchesDescription = productList[productIndex].description.toLowerCase().indexOf(searchTerms[termIndex]) != -1;
            if (!matchesName && !matchesDescription) {
                match = false;
                break;
            }
        }
        if (match) {
            searchResults.push(productList[productIndex]);
        }
    }
    var settings;
    if (searchResults.length == 0) {
        settings = {
            subtitle: "Search",
            message: "Sorry, no products matched \"" + searchTerms.join(' ') + "\". Have a look at some other items:",
            products: productList
        };
        res.render('shop/storefront', settings);
    } else {
        settings = {
            subtitle: "Search",
            message: "These are all products that match \"" + searchTerms.join(' ') + "\":",
            products: searchResults
        };
        res.render('shop/storefront', settings);
    }

}

// GET /product/XXXXXXX
router.get('/:subpage', productRouterCallback);
function productRouterCallback(req, res, next) {
    var productList = productLoader.list;
    var subpage = req.params.subpage;
    var settings;
    if (!subpage) {
        return res.redirect('/');
    } else if ((subpage === "boards") || (subpage === "sails") || (subpage === "masts") || (subpage == "booms")) {
        var productTypeFilter = function (product) { return product.type === subpage.slice(0, -1); };
        settings = {
            subtitle: subpage[0].toUpperCase() + subpage.substring(1),
            message: "These are all our " + subpage + ":",
            products: productList.filter(productTypeFilter)
        };
        res.render('shop/storefront', settings);
    } else {
        var idProductFinder = function (product) { return product.id == subpage; };
        var product = productList.find(idProductFinder);
        if (!product) {
            return res.redirect('/');
        }
        settings = {
            subtitle: product.name,
            product: product
        };
        res.render('shop/product', settings);
    }

}


module.exports = router;
