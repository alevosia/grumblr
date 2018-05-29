var mongoose = require('mongoose');
// Models
var User = require('./user');
var Image = require('./image');
var Comment = require('./comment');

var PostSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    utcMS: {type: Date, default: Date.now()},                // the milliseconds in UTC
    text: String,
    image: {type: mongoose.Schema.Types.Object, ref: 'Image'},
    comments: [] // Comment documents
});

PostSchema.methods.AddComment = function(Comment) {
    this.comments.push(Comment)
}
 
module.exports = mongoose.model('Post', PostSchema);