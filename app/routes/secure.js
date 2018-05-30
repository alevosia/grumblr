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
        res.redirect('/profile');
    });

    router.get('/profile', function(req, res){
        User.findById({'_id': req.user._id}).populate('profileImage coverImage').exec(function(err, user) {
            Post.find({}).populate('image User').populate({
                path: 'User',
                populate: { path: 'profileImage',
                            model: 'Image'}
            }).sort({'utcMS':-1}).exec(function(err, resultPosts) {
                if (err) throw err;
                var posts = [];
                if (resultPosts.length > 0) {
                    for (var i=0; i<resultPosts.length; i++) {
                        if (resultPosts[i].User.username == user.username) {
                            posts.push(resultPosts[i])
                            console.log('Posts ' + posts.length);
                        } else {
                            console.log(resultPosts[i].User._id + ' ' + user._id);
                        }
                    }
                }
                res.render('profile.ejs', { user:user, posts:posts})
            })
        })
    });

    // USERS ======================================================
    // localhost:8080/users/<username>
    router.get('/users/:username', function(req, res) {
        User.findById({'_id': req.user._id}).populate('coverImage').exec(function(err, user) {
            if (err) throw err;

            User.findOne({'username': req.params.username}).populate('profileImage coverImage').exec(function(err, visitedUser) {
                if (err) throw err;

                Post.find({}).sort({'utcMS': -1}).populate('image User').populate({
                    path: 'User',
                    populate: { path: 'profileImage',
                                model: 'Image'}
                }).sort({'utcMS':-1}).exec(function(err, resultPosts) {
                    if (err) throw err;
                    var posts = [];
                    if (resultPosts.length > 0) {
                        for (var i=0; i<resultPosts.length; i++) {
                            if (resultPosts[i].User) {
                                if (resultPosts[i].User.username) {
                                    if (resultPosts[i].User.username == visitedUser.username) {
                                        posts.push(resultPosts[i])
                                        console.log('Posts ' + posts.length);
                                    }
                                } else {
                                    console.log(resultPosts[i].User._id + ' ' + visitedUser._id);
                                }
                            }
                        }
                    } res.render('visitedprofile.ejs', {user: req.user, visitedUser: visitedUser, posts: posts});
                })
            })
        })
    })

    router.get('/timeline', function(req, res){
        User.findById({'_id': req.user._id}).populate('profileImage').exec(function(err, user) {
            Post.find({}).populate('image').populate({
                path: 'User',
                populate: { path: 'profileImage',
                            model: 'Image'}
            }).sort({'utcMS':-1}).exec(function(err, posts) {
                console.log(posts);
                res.render('timeline.ejs', {user: user, posts: posts});
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

    // deleting a post
    router.get('/delete/:_id', function(req, res) {
        var postId = req.params._id;
        Post.findOneAndRemove({'_id': postId}, function(err, deletedPost) {
            console.log('Deleted' + deletedPost.text);
        })
        res.redirect('/timeline');
    })

    // deleting a post
    router.get('/edit/:_id', function(req, res) {
        res.redirect('/timeline');
    })

    router.post('/search', function(req, res) {
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