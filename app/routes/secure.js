// /app/routs/secure.js

module.exports = function(router) {

    var fs = require('fs');
    var mongoose = require('mongoose')
    var Image = require('../models/image.js');
    var Post = require('../models/post.js');
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
    router.get('/profile', function(req, res){
        Post.find({'username': req.user.username}).sort({'utcMS': -1}).populate('image')
        .exec(function(err, posts) {
            if (err) throw err;
            console.log(posts);
            res.render('profile.ejs', {user: req.user, posts: posts}
        )}
    )});

    router.get('/timeline', function(req, res){
        Post.find().sort({'utcMS': -1}).populate('image')
        .exec(function(err, posts) {
            if (err) throw err;
            console.log(posts);
            res.render('timeline.ejs', {user: req.user, posts: posts}
        )}
    )});

    router.get('/settings', function(req, res) {
        res.render('settings.ejs', {user: req.user});
    })

    router.post('/send', function(req, res) {
        
       
        if (req.file) {
            console.log(req.file);
            var data = fs.readFileSync(req.file.path, {encoding: 'base64'});

            var imageDocument = new Image({
                _id: new mongoose.Types.ObjectId(),
                img: {
                    data: data,
                    contentType: req.file.mimetype
                }
            });

            imageDocument.save(function(err) {
                if (err) throw err;

                var post = new Post({
                    _id: new mongoose.Types.ObjectId(),
                    username: req.user.username,
                    text:  req.body.text,
                    image: imageDocument._id,
                    comments: []
                });

                post.save(function (err) {
                    if (err) throw err;
                })
            });
            
        } else {
            console.log('No image uploaded.');
            var post = new Post({
                _id: new mongoose.Types.ObjectId(),
                username: req.user.username,
                text:  req.body.text,
                image: null,
                comments: []
            });

            post.save(function (err) {
                if (err) throw err;
            })
        }
        res.redirect('/profile');
    })

    // USERS ======================================================
    // localhost:8080/users/<username>
    router.get('/users/:username', function(req, res) {
        User.findOne({'username':req.param('username')}, function(err, user) {
            if (err) throw err;
            console.log(user)
            res.render('profile.ejs', {user: user});
        });
    })

    router.post('/search/users', function(req, res) {
        User.find().exec(function(err, users) {
            if (err) throw err;
            console.log(users)
            res.render('search.ejs', {user: req.user, searchUsers: users});
        })
    })
}