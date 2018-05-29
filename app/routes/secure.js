// /app/routs/secure.js

module.exports = function(router) {

    var User = require('../models/user.js');
    // AUTHENTICATION ===========================================
    router.use(function(req, res, next) {
        if (req.isAuthenticated()) {
            //res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
            return next();
        }
        res.redirect('/auth');
    })

    // AUTHENTHICATED ROUTES 
    // the user must be logged in before they can access the following routes

    // PROFILE ====================================================
    // localhost:8080/profile
    router.get('/profile', function(req, res) {
        res.render('profile.ejs', {user: req.user});
    })

    router.get('/timeline', function(req, res) {
        res.render('timeline.ejs', {user: req.user});
    })

    router.get('/settings', function(req, res) {
        res.render('settings.ejs', {user: req.user});
    })

    // USERS ======================================================
    // localhost:8080/users/<username>
    router.post('/search/users', function(req, res) {
        User.find({'username':{'$regex': req.body.searchQuery, '$options':'i'}}, function(err, users) {
            if (err) throw err;
            console.log(users)
            res.render('search.ejs', {user: req.user, searchUsers: users});
        });
    })

    router.get('/*', function(req, res) {
        res.redirect('/profile');
    })
}