var mongoose    = require('mongoose');
var fs          = require('fs');
var bcrypt      = require('bcrypt');
const rounds    = 10; // WARNING! Don't go above 10
var Image       = require('./image');
var Post        = require('./post');

var UserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    emailAddress: String,
    gender: String,
    bio: {type: String, default: 'Update your bio'},
    profileImage: {type: mongoose.Schema.Types.Object, ref: 'Image'},
    coverImage: {type: mongoose.Schema.Types.Object, ref: 'Image'},
    posts: {type:Number, default: 0},
    following: {type: Number, default: 0},
    followers: {type: Number, default: 0},
    followedUsers: []
});

UserSchema.statics.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(rounds));
}

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

UserSchema.methods.UpdateBio = function(bio) {
    this.bio = bio;
}

UserSchema.methods.AddFollowing = function() {
    this.following += 1;
}

UserSchema.methods.MinusFollowing = function() {
    this.following -= 1;
}

UserSchema.methods.AddFollowers = function() {
    this.followers += 1;
}

UserSchema.methods.MinusFollowers = function() {
    this.followers -= 1;
}

UserSchema.methods.SendNewPost = function(req, res) {
    if (req.files.length > 0) {
        console.log(req.files);
        var data = fs.readFileSync(req.files[0].path, {encoding: 'base64'});

        var imageDocument = new Image({
            _id: new mongoose.Types.ObjectId(),
            img: {
                name: req.files[0].originalname,
                data: data,
                contentType: req.files[0].mimetype
            }
        });

        imageDocument.save(function(err) {
            if (err) throw err;

            var post = new Post({
                _id: new mongoose.Types.ObjectId(),
                User: req.user._id,
                text: req.body.text,
                utcMS: Date.now(),
                image: imageDocument._id,
                comments: []
            });

            post.save(function (err) {
                if (err) throw err;
                req.user.set({'posts': req.user.posts+1})
                req.user.save(function(err, updatedUser) {
                if (err) throw err;
                console.log('Updated ' + updatedUser.username + '\'s post count to' + updatedUser.posts);
            });
            })
        });
        
    } else {
        console.log('No image uploaded.');
        var post = new Post({
            _id: new mongoose.Types.ObjectId(),
            User: req.user._id,
            text:  req.body.text,
            utcMS: Date.now(),
            comments: []
        });

        post.save(function (err) {
            if (err) throw err;
            req.user.set({'posts': req.user.posts+1})
            req.user.save(function(err, updatedUser) {
                if (err) throw err;
                console.log('Updated ' + updatedUser.username + '\'s post count.');
            });
        })
    }
}

UserSchema.methods.UpdateProfileImage = function(req, res) {
    
    console.log('Entered Update Profile Image');
    if (req.files[0].fieldname == 'photo') {
        var data = fs.readFileSync(req.files[0].path, {encoding: 'base64'});

        var imageDocument = new Image({
            _id: new mongoose.Types.ObjectId(),
            img: {
                data: data,
                contentType: req.files[0].mimetype
            }
        });

        imageDocument.save(function(err) {
            if (err) throw err;
            req.user.set({'profileImage': imageDocument._id})
            req.user.save(function (err, updatedUser) {
                if (err) throw err;
                console.log('Updated profileImage of ' + updatedUser.username);
            })
        })
    } else {
        console.log('Wrong fieldname in UpdateProfileImage!');
    }

}

UserSchema.methods.UpdateCoverImage = function(req, res) {
    if (req.files.length == 1) {
        console.log(req.files[0]);
        if (req.files[0].fieldname == 'coverImage') {
            var data = fs.readFileSync(req.files[0].path, {encoding: 'base64'});

            var imageDocument = new Image({
                _id: new mongoose.Types.ObjectId(),
                img: {
                    data: data,
                    contentType: req.files[0].mimetype
                }
            });

            imageDocument.save(function(err) {
                if (err) throw err;

                req.user.set({'coverImage': imageDocument._id})
                req.user.save(function (err, updatedUser) {
                    if (err) throw err;
                    console.log('Updated profileImage of ' + updatedUser.username);
                })
            })
        } else {
            console.log('Wrong fieldname in UpdateCoverImage');
        }
    } else if (req.files.length == 2) {
        console.log(req.files[1]);
        if (req.files[1].fieldname == 'coverImage') {
            var data = fs.readFileSync(req.files[1].path, {encoding: 'base64'});

            var imageDocument = new Image({
                _id: new mongoose.Types.ObjectId(),
                img: {
                    data: data,
                    contentType: req.files[1].mimetype
                }
            });

            imageDocument.save(function(err) {
                if (err) throw err;
                req.user.set({'coverImage': imageDocument._id})
                req.user.save(function (err, updatedUser) {
                    if (err) throw err;
                    console.log('Updated profileImage of ' + updatedUser.username);
                })
            })
        } else {
            console.log('Wrong fieldname in UpdateCoverImage');
        }
    }
    
}

module.exports = mongoose.model('User', UserSchema);