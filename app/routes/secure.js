// /app/routs/secure.js

module.exports = function(router) {

    var fs = require('fs');
    var mongoose = require('mongoose')
    var Image = require('../models/image.js');
    var Post = require('../models/post.js');
    var User = require('../models/user.js');
    var Comment =  require('../models/comment.js');
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
            Post.find({}).populate('image User')
            .populate({
                path: 'User',
                populate: { path: 'profileImage',
                            model: 'Image'}
            }).populate({
                path: 'comments',
                populate: { path: 'User',
                            model: 'User' }
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
        User.findById({'_id': req.user._id}).populate('profileImage').exec(function(err, user) {
            if (err) throw err;

            User.findOne({'username': req.params.username}).populate('profileImage coverImage').exec(function(err, visitedUser) {
                if (err) throw err;

                Post.find({}).sort({'utcMS': -1}).populate('image comments').populate({
                    path: 'User',
                    populate: { path: 'profileImage',
                                model: 'Image'}
                }).populate({
                    path: 'comments',
                    populate: { path: 'User',
                            model: 'User'}})
                .sort({'utcMS':-1}).exec(function(err, resultPosts) {
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
            Post.find({}).populate('image comments').populate({
                path: 'User',
                populate: { path: 'profileImage',
                            model: 'Image'}
            }).populate({
                path: 'comments',
                populate: { path: 'User',
                            model: 'User' }
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

    router.post('/comment/:_id', function(req, res) {
        Post.findById({'_id':req.params._id}).populate('comments').exec(function(err, post) {
            console.log(req.body.commentText);
            var comment = new Comment({
                _id: new mongoose.Types.ObjectId(),
                User: req.user._id,
                text: req.body.commentText,
                utcMS: Date.now()
            });

            comment.save(function(err, comment) {
                console.log(comment.text + ' has been saved.');
                post.comments.push(comment._id);
                post.save(function(err, newPost) {
                    if (err) throw err;
                    console.log('newPost comments: ' + newPost.comments.length);
                    res.redirect('/timeline');
                })
            })
        })
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

        if(req.body) {
            if(req.body.firstName && req.body.firstName != req.user.firstName) {
                req.user.set({'firstName': req.body.firstName});
                req.user.save(function(err, newUser) {
                    if (err) throw err;
                    console.log(newUser.username + '\'s firstName has been updated to ' + req.body.firstName);
                })
            }
            if(req.body.lastName && req.body.lastName != req.user.lastName) {
                req.user.set({'lastName': req.body.lastName});
                req.user.save(function(err, newUser) {
                    if (err) throw err;
                    console.log(newUser.username + '\'s lastName has been updated to ' + req.body.lastName);
                })
            }
            if (req.body.currentPassword && req.body.newPassword1 &&req.body.newPassword2) {
                var cp = req.body.currentPassword;
                var np1 = req.body.newPassword1;
                var np2 = req.body.newPassword2;

                if (req.user.validPassword(cp)) {
                    if (np1 == np2) {
                        req.user.set({'password': User.generateHash(np1)});
                        req.user.save(function(err, newUser) {
                            if (err) throw err;
                            console.log(req.user.username + '\'s password has been changed to ' + np1);
                        })
                    } else {
                        res.redirect('/settings');
                    }
                } else {
                    res.redirect('/settings');
                }
            }
            if(req.body.biography && req.body.biography != req.user.biography) {
                req.user.set({'bio': req.body.biography});
                req.user.save(function(err, newUser) {
                    if (err) throw err;
                    console.log(newUser.username + '\'s bio has been updated to ' + req.body.biography);
                })
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
            req.user.set({'posts': req.user.posts-1})
            req.user.save(function(err, updatedUser) {
                if (err) throw err;
                console.log('Updated ' + updatedUser.username + '\'s post count to ' + updatedUser.posts);
            })
        })
        res.redirect('/timeline');
    })

    // deleting a post
    router.post('/edit/:_id', function(req, res) {
        Post.findById({'_id': req.params._id}).exec(function(err, post) {
            if (err) throw err;
            if (post) {
                post.set({'text': req.body.editText});
                post.save(function(err, newPost) {
                    if (err) throw err;
                    console.log('Post edited text to ' + req.body.editText);
                    res.redirect('/timeline');
                })
            } else {
                console.log('No post found.');
            }
        })
    })

    router.post('/search', function(req, res) {
        User.find({'$or':[{'firstName': {'$regex': req.body.searchQuery, '$options':'i'}},
                          {'lastName': {'$regex': req.body.searchQuery, '$options':'i'}},
                          {'username': {'$regex': req.body.searchQuery, '$options':'i'}}]})
        .populate('profileImage').exec(function(err, users) {
            if (err) throw err;
            Post.find({}).populate('image comments')
            .populate({
                    path: 'User',
                    populate: {path: 'profileImage',
                    model: 'Image'}
            }).populate({
                    path: 'comments',
                    populate: { path: 'User',
                                model: 'User'}
            }).sort({'utcMS': -1})
            .exec(function(err, resultPosts) {
                if (users.length > 0) {
                    var usernames = [];
                    for (var j=0; j<users.length; j++) {
                        usernames.push(users[j].username)
                    }
                    console.log(usernames);
                }
                var posts = [];
                if (resultPosts.length > 0) {
                    for (var i=0; i<resultPosts.length; i++) {
                        if (usernames.includes(resultPosts[i].User.username)) {
                            posts.push(resultPosts[i]);
                        }
                    }
                }
                if (err) throw err;
                res.render('search.ejs', {user: req.user, searchUsers: users, posts: posts});
            })
        })
    })
}