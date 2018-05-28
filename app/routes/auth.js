module.exports = function(router, passport) {
    var User = require('../models/user.js');

    // LOGIN   ====================================================
    // localhost:8080/auth/
    router.get('/', function(req, res) {
        res.render('login.ejs');
    })

    router.post('/', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/auth/'
    }))

    // SIGNUP   ===================================================
    // localhost:8080/auth/signup
    router.get('/signup', function(req, res) {
        //                     if the passport authentication sends a message of failure
        res.render('signup.ejs', {message: req.flash('signupMessage')}); 
    })

    router.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/auth',
        failureRedirect: '/auth/signup',
        failureFlash: true
    }));

    // LOGOUT  ===================================================
    // localhost:8080/auth/logout
    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/auth');
    })

    // invalid GET url
    router.get('/*', function(req, res) {
        res.redirect('/');
    })
}