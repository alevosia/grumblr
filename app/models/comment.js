var mongoose = require('mongoose');
var User = require('./user');

var CommentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    User: {type: mongoose.Schema.ObjectId, ref: 'User'}, 
    text: String,
    utcMS: {type: Date, default: Date.now()}
})

module.exports = mongoose.model('Comment', CommentSchema);