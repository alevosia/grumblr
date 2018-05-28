var mongoose = require('mongoose');
var fs = require('fs');

var ImageSchema = new mongoose.Schema({
    base64String: String,
    fileName: String,
    fileType: String
});

ImageSchema.methods.SetBase64String = function(imagePath) {
    this.base64String = fs.readFileSync(imagePath, {encoding: 'base64'});
    console.log(imagePath);
    var i = imagePath.lastIndexOf('\\')+1;
    console.log(imagePath.substr(i));
    this.SetFileName(imagePath.substr(i))
}

ImageSchema.methods.SetFileName = function(fileName) {
    this.fileName = fileName;
    console.log('File Name: ' + this.fileName);
    var i = this.fileName.lastIndexOf('.')+1;
    this.SetFileType(this.fileName.substr(i));
}

ImageSchema.methods.SetFileType = function(fileType) {
    this.fileType = fileType;
    console.log('File Type: ' + this.fileType);
}

module.exports = mongoose.model('Image', ImageSchema);