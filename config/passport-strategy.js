/*jshint node:true, latedef:nofunc*/

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var sqlite3 = require('sqlite3');

// Tell Passport to store the user id in the session
passport.serializeUser(serializeUserCallback);

function serializeUserCallback(user, done) {
    return done(null, user.id);
}

// Tell Passport how to retrieve a user from from the id
passport.deserializeUser(deserializeUserCallback);

function deserializeUserCallback(id, done) {
    var db = new sqlite3.Database('./db/database.db', sqlite3.OPEN_READONLY);
    db.get('SELECT id, firstname, surname, email FROM users WHERE id = ?', id, findUserCallback);

    function findUserCallback(err, user) {
        if (err) {
            return done(err, false, { message: "Error. Try again later." });
        }
        if (!user) {
            return done(null, false, { message: "User not found." });
        }
        return done(err, user);
    }
    db.close();
}


var strategyConfig = {
    usernameField: 'email',
    passportField: 'password',
    passReqToCallback: true
};
// Give Passport a sign-in strategy
passport.use('local.signin', new LocalStrategy(strategyConfig, signinCallback));

function signinCallback(req, email, password, done) {
    req.checkBody('email').isEmail();
    if (req.validationErrors()) {
        return done(null, false, { message: "Invalid Email" });
    }

    var db = new sqlite3.Database('./db/database.db', sqlite3.OPEN_READWRITE);
    db.get('SELECT id, email, password FROM users WHERE email = ?', [email.toLowerCase()], getUserCallback);

    function getUserCallback(err, user) {
        if (err) {
            return done(err, false, { message: "Error. Try again later." });
        }
        if (!user) {
            return done(null, false, { message: "User not found." });
        }
        if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false, { message: "Wrong Password" });
        }

        console.log("User", user.id, "with email:", user.email, "found.");
        return done(null, user);
    }
    db.close();
}

// Give Passport a sign-up strategy
passport.use('local.signup', new LocalStrategy(strategyConfig, signupCallback));

function signupCallback(req, email, password, done) {
    req.checkBody('email', 'Invalid Email').isEmail();
    req.checkBody('password', 'Invalid password - must be at least 6 characters').isLength({ min: 6 });
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }

    var db = new sqlite3.Database('./db/database.db', sqlite3.OPEN_READWRITE);
    db.get('SELECT id FROM users WHERE email = ?', [email.toLowerCase()], checkDatabaseCallback);

    function checkDatabaseCallback(err, user) {
        "use strict";
        if (err) {
            return done(err, false, { message: "Error adding user. Try again later." });
        }
        if (user) {
            return done(null, false, { message: "Email address already in use." });
        }

        // if no errors and a new user, hash the password and add to the database
        var hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
        var values = [req.body.firstname, req.body.surname, email.toLowerCase(), hashedPassword];
        db.run('INSERT INTO users (firstname, surname, email, password) Values(?,?,?,?)', values, insertUserCallback);

        function insertUserCallback(err) {
            if (err) {
                return console.log(err.message);
            }
        }

        // Get the assigned ID and check the user was added to the database
        db.get('SELECT id, firstname, surname, email FROM users WHERE email = ?', [email.toLowerCase()], getIdCallback);

        function getIdCallback(err, user) {
            if (err) {
                return done(err, false, { message: "Error adding user. Try again later." });
            }
            if (!user) {
                return done(null, false, { message: "Error adding user. Try again later." });
            }

            console.log("A new user", user.firstname, user.surname, "with email:", user.email, "was added to user table with id:", user.id);
            return done(null, user);
        }
    }
    db.close();
}
