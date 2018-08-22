/*jshint node:true, latedef:nofunc*/
"use strict";

var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var csrf = require('csurf');
var passport = require('passport');

// protect all routes in this file with csrf protection
router.use(csrf());

// if the visitor goes to /user/account, redirect to the signin page, or show account
router.get('/account', userRouterCallback);
function userRouterCallback(req, res, next) {
    if (req.isAuthenticated()) {
        return res.render('user/account', {
            subtitle: "Account",
            user: req.user
        });
    }
    res.redirect('/user/signin');
}

// logging out done through a GET request to /user/logout page
router.get('/logout', logoutCallback);
function logoutCallback(req, res, next) {
    req.logout();
    res.redirect('/');
}


// Add a middleware to all other routes - redirect to homepage if already signed in
router.use('/', checkNotLoggedIn, function (req, res, next) { next(); });
function checkNotLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}


// sign-up page, GET /user/signup
router.get('/signup', signupRouterCallback);
function signupRouterCallback(req, res, next) {
    res.render('user/signup', {
        subtitle: "Sign Up",
        csrfToken: req.csrfToken(),
        messages: req.flash('error') // flash any 'error' that comes through from passport
    });
}

// sign-in page, GET /user/signin
router.get('/signin', signinRouterCallback);
function signinRouterCallback(req, res, next) {
    res.render('user/signin', {
        subtitle: "Sign In",
        csrfToken: req.csrfToken(),
        messages: req.flash('error') // flash any 'error' that comes through from passport
    });
}


// POST responses to signup form
var signUpRedirects = {
    successRedirect: '/user/account',
    failureRedirect: '/user/signup',
    failureFlash: true
};
router.post('/signup', passport.authenticate('local.signup', signUpRedirects));

// POST responses to signin form
var signInRedirects = {
    successRedirect: '/user/account',
    failureRedirect: '/user/signin',
    failureFlash: true
};
router.post('/signin', passport.authenticate('local.signin', signInRedirects));



module.exports = router;
