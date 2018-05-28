var mongoose    = require('mongoose');
var bcrypt      = require('bcrypt');
const rounds    = 10; // WARNING! Don't go above 10
var Image       = require('./image');

var UserSchema = new mongoose.Schema({
    username: String,
    //email_address: String,
    password: String,
    bio: {type: String, default: 'Update your bio'},
    profileImage: {type: mongoose.Schema.ObjectId, ref: 'Image'},
    coverImage: {type: mongoose.Schema.ObjectId, ref: 'Image'},
    following: {type: Number, default: 0},
    followers: {type: Number, default: 0}
});

UserSchema.methods.generateHash = function(password) {
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

UserSchema.methods.UpdateProfileImage = function(Image) {
    this.profileImage = Image
}

UserSchema.methods.UpdateCoverImage = function(Image) {
    this.coverImage = Image
}

module.exports = mongoose.model('User', UserSchema);