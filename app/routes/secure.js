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
    router.get('/', function(req, res){
        Post.find({'username': req.user.username}).sort({'utcMS': -1}).populate('image')
        .exec(function(err, posts) {
            if (err) throw err;
            console.log(posts);
            res.render('profile.ejs', {user: req.user, posts: posts}
        )}
    )});

    router.get('/profile', function(req, res){
        User.findById({'_id': req.user._id}).populate('profileImage coverImage').exec(function(err, user) {
            Post.find({'username': req.user.username}).populate('image').exec(function(err, posts) {
                res.render('profile.ejs', { user:user, posts:posts})
            })
        })
    });

    router.get('/timeline', function(req, res){
        User.findById({'_id': req.user._id}).populate('profileImage coverImage').exec(function(err, user) {
            Post.find().populate('image').exec(function(err, posts) {
                function removeDuplicates(arr){
                    let unique_array = []
                    for(let i = 0;i < arr.length; i++){
                        if(unique_array.indexOf(arr[i]) == -1){
                            unique_array.push(arr[i])
                        }
                    }
                    return unique_array
                }
                for (var i = 0; i < posts.length; i++) {
                    var usernames = posts[i].username;
                }
                usernames = removeDuplicates(usernames);
                console.log(usernames);
                User.find({'username':{'$in': usernames}}).populate('profileImage').exec(function(err, postUsers) {
                    res.render('timeline.ejs', { user:user, post:posts, postUsers: postUsers})
                })
            })
        })
    });

    router.post('/send', function(req, res) {
        
        req.user.SendNewPost(req, res);
        res.redirect('/profile');
    })

    router.get('/settings', function(req, res) {
        User.findById({'_id': req.user._id}).populate('profileImage coverImage').exec(function(err, user) {
            Post.find().populate('image').exec(function(err, posts) {
                res.render('settings.ejs', { user:user})
            })
        })
    })

    router.post('/settings', function(req, res) {
        if (req.files) {
            console.log(req.files.length + ' pictures uploaded in settings.');
            if (req.files.length == 2) {
                console.log(req.files.length + ' pictures uploaded in settings.');
                req.user.UpdateProfileImage(req, res);
                req.user.UpdateCoverImage(req, res);

            } else if (req.files.length == 1) {
                console.log('Fieldname: ' + req.files[0].fieldname);
                if (req.files[0].fieldname == 'photo') {
                    req.user.UpdateProfileImage(req, res);
                } else if (req.files[0].fieldname == 'coverImage') {
                    req.user.UpdateCoverImage(req, res);
                }
            } else {
                console.log('Else: ' + req.files.length);
            }
        }
        res.redirect('/settings');
    })

    router.post('/follow/:username', function(req, res) {

    })

    router.post('/unfollow/:username', function(req, res) {
        
    })


    // USERS ======================================================
    // localhost:8080/users/<username>
    router.get('/users/:username', function(req, res) {
        User.findOne({'username':req.param('username')}, function(err, visitedUser) {
            if (err) throw err;
            console.log(user)
            res.render('visitedprofile.ejs', {user: req.user, visitedUser: visitedUser});
        });
    })

    router.post('/search/users', function(req, res) {
        User.find({'$or':[{'firstName': {'$regex': req.body.searchQuery, '$options':'i'}},
                          {'lastName': {'$regex': req.body.searchQuery, '$options':'i'}},
                          {'username': {'$regex': req.body.searchQuery, '$options':'i'}}]})
        .populate('profileImage').exec(function(err, users) {
            for (var i = 0; i < users.length; i++) {
                var usernames = [];
                usernames.push(users[i].username);
            }

            Post.find({'username':{'$in': usernames}}).populate('image').exec(function(err, posts) {
                    if (err) throw err;
                    console.log(users)
                    res.render('search.ejs', {user: req.user, searchUsers: users, posts: posts});
            })
        })
    })
}