var mongoose    = require('mongoose');
var fs          = require('fs');
var bcrypt      = require('bcrypt');
const rounds    = 10; // WARNING! Don't go above 10
var Image       = require('./image');

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    emailAddress: String,
    gender: String,
    bio: {type: String, default: 'Update your bio'},
    profileImage: {
        base64String: String,
        fileName: String,
        fileType: String
    },
    coverImage: {
        base64String: String,
        fileName: String,
        fileType: String
    },

    following: {type: Number, default: 0},
    followers: {type: Number, default: 0}
});

UserSchema.methods.SetProfileImage = function(imagePath) {
    console.log(imagePath);
    this.profileImage.base64String = fs.readFileSync(imagePath, {encoding: 'base64'});
    var i = imagePath.lastIndexOf('\\')+1;
    console.log(imagePath.substr(i));
    this.profileImage.fileName = imagePath.substr(i);
    console.log('File Name: ' + this.profileImage.fileName);
    var i = this.profileImage.fileName.lastIndexOf('.')+1;
    this.profileImage.fileType = this.profileImage.fileName.substr(i);
    console.log('File Type: ' + this.profileImage.fileType);
}

UserSchema.methods.SetCoverImage = function(imagePath) {
    this.coverImage.base64String = fs.readFileSync(imagePath, {encoding: 'base64'});
    console.log(imagePath);
    var i = imagePath.lastIndexOf('\\')+1;
    console.log(imagePath.substr(i));
    this.coverImage.fileName = imagePath.substr(i);
    console.log('File Name: ' + this.coverImage.fileName);
    var i = this.coverImage.fileName.lastIndexOf('.')+1;
    this.coverImage.fileType = this.coverImage.fileName.substr(i);
    console.log('File Type: ' + this.coverImage.fileType);
}

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