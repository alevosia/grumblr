var mongoose    = require('mongoose');
var fs          = require('fs');
var bcrypt      = require('bcrypt');
const rounds    = 10; // WARNING! Don't go above 10
var Image       = require('./image');

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

UserSchema.methods.UpdatePassword = function(password) {
    this.password = this.generateHash(password);
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
    if (req.files) {
        console.log(req.files);
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
            this.posts += 1; // updates the posts counter of the user
        })
    }
}

UserSchema.methods.UpdateProfileImage = function(req, res) {
    if (req.files) {
        console.log(req.files)
    }
}

UserSchema.methods.UpdateCoverImage = function(Image) {
    this.coverImage = Image
}

module.exports = mongoose.model('User', UserSchema);