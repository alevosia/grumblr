var mongoose = require('mongoose');
var fs      = require('fs');
// Models
var User = require('./user');
var Image = require('./image');
var Comment = require('./comment');

var PostSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    User: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    utcMS: {type: Date},            // the milliseconds in UTC
    text: String,
    image: {type: mongoose.Schema.Types.ObjectId, ref: 'Image'},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] // Comment documents
});
 
module.exports = mongoose.model('Post', PostSchema);