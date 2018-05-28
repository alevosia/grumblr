var mongoose = require('mongoose');
var User = require('./user');

var CommentSchema = mongoose.Schema({
    User: {type: mongoose.Schema.ObjectId, ref: 'User'}, 
    text: String,
    utcMS: {type: Date, default: Date().getTime()}
})

module.exports = mongoose.model('Comment', CommentSchema);