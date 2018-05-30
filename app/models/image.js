var mongoose = require('mongoose');
var fs = require('fs');

var ImageSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    img: { data: Buffer, contentType: String }
});

module.exports = mongoose.model('Image', ImageSchema);