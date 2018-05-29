var LocalStrategy = require('passport-local').Strategy;

var fs = require('fs');
var User = require('../app/models/user');
var Image = require('../app/models/image');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);  // stores the user's id in session
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);  // getting all the data of the user using its id
        });
    });

    passport.use('local-signup', new LocalStrategy({
            // default values, can be not declared
            usernameField: 'username', 
            passwordField: 'password',
            passReqToCallback: true // passses the request object to the callback
    },
        function(req, username, password, done) {
            process.nextTick(function() {
                if (req.body.password != req.body.confirmPassword) {
                    console.log('Password confirm mismatch.')
                    return done(null, false) 
                };
                User.findOne({$or: [{'username': username}, {'emailAddress': req.body.email} ]}, function(err, user) {
                    if  (err) { return done(err); }
                    if (user) { // if the username already exists
                        return done(null, false, req.flash('signupMessage', 'Username or email address is already taken.'));
                    } 
                    else {
                        var newUser = User();
                        var defaultProfileImage = Image();
                        var defaultCoverImage = Image();

                        defaultProfileImagePath = __dirname + '\\images\\profileImage.png';
                        console.log(defaultProfileImagePath);
                        defaultCoverImagePath = __dirname + '\\images\\placeholderImage2.png';
                        console.log(defaultCoverImagePath);
                        
                        newUser.SetProfileImage(defaultProfileImagePath);
                        newUser.SetCoverImage(defaultCoverImagePath);
                        newUser.username = username;
                        newUser.password = newUser.generateHash(password);
                        newUser.firstName = req.body.firstName;
                        newUser.lastName = req.body.lastName;
                        newUser.emailAddress = req.body.email;
                        newUser.gender = req.body.gender;
                        newUser.profileImage = defaultProfileImage;
                        newUser.coverImage = defaultCoverImage;
                        
                        newUser.save(function(err) {
                            if (err) throw err;
                            return done(null, newUser); // return the new user
                        })
                    }
                })
            })
        }
    ))

    passport.use('local-login', new LocalStrategy({
        // names of the fields in the form
        usernameField: 'email', 
        passwordField: 'password',
        passReqToCallback: true // passses the request object to the callback
    },
        function(req, email, password, done) {
            process.nextTick(function() {
                console.log(email);
                User.findOne({'emailAddress': email}, function(err, user) {
                    if (err) { return done(err); }
                    if (!user) {
                        return done(null, false, req.flash('loginMessage', 'Email does not exist.'));
                    }
                    if (!user.validPassword(password)) {
                        return done(null, false, req.flash('loginMessage', 'Password does not match.'))
                    }
                    return done(null, user); // sends/binds the user object to the request
                })
            })
        }
    ))
}