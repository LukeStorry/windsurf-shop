#!/usr/bin/env node
/*jshint node:true, latedef:nofunc*/

var express = require('express');
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var SQLiteStore = require('connect-sqlite3')(session);
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var favicon = require('serve-favicon');
var http = require('http');

var indexRouter = require('./routes/index');
var productRouter = require('./routes/product');
var cartRouter = require('./routes/cart');
var userRouter = require('./routes/user');
var designRouter = require('./routes/design');
require("./config/passport-strategy");

var app = express();

// middleware setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(favicon(path.join(__dirname, 'public', 'images', 'logo.png')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
    store: new SQLiteStore({ db: 'sessions.db', dir: 'db' }),
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 1 week
    secret: 'secretsessionsecret',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// custom middleware to give templates access to "loggedIn" and "session" variables
app.use(loggedInSessionMiddleware);
function loggedInSessionMiddleware(req, res, next) {
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.session = req.session;
    next();
}

// serve the public files statically
app.use(express.static(path.join(__dirname, 'public')));

// attach routes
app.use('/design', designRouter);
app.use('/user', userRouter);
app.use('/cart', cartRouter);
app.use('/products', productRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(errorCatcher);

function errorCatcher(req, res, next) {
    next(createError(404));
}

// error handler
app.use(errorHandler);
function errorHandler(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = []; // err;

    // render the error page
    res.status(err.status || 500);
    res.render('error');
}



// Get port from environment and store in Express.
var port = normalizePort(process.env.PORT || '3000');
function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) { return val; }
    if (port >= 0) { return port; }
    return false;
}
app.set('port', port);



// start the server (http only as https is handled by hosting)
http.createServer(app).listen(port);
console.log('Server started: http://localhost:3000');
console.log();
