var mongoose = require('mongoose');
// Models
var User = require('./user');
var Image = require('./image');
var Comment = require('./comment');

var PostSchema = new mongoose.Schema({
    user: User,
    utcMS: {type: Date, default: Date().getTime()},                // the milliseconds in UTC
    text: String,
    base64ImageString: String,
    filetype: {default: image/jpeg},
    comments: [] // Comment documents
});

PostSchema.methods.AddComment = function(Comment) {
    this.comments.push(Comment)
}
 
module.exports = mongoose.model('Post', PostSchema);