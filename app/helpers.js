
exports.CreateImageJSON = function(name, type, base64String) {

    var imageJSON = {
        "image_name": name,
        "image_type": type,
        "base64String": base64String
    }

    return imageJSON
}

exports.CreateBlogJSON = function(username, utcMS, text, imageJSON) {
    if (imageJSON) { imageJSON = imageJSON } 
    if (text) { text = text }

    var blogJSON = {
        "username": username,
        "utcMS": utcMS,
        "text":text,
        "image": imageJSON,
        "comments": [
            {
                "username": "paoloLatoja",
                "user_image_url": "paolo.jpg",
                "text": "send bobs"
            },
            {
                "username": "nathanSaludes",
                "user_image_url": "nathan.jpg",
                "text": "and vagene"
            }
        ]
    }

    return blogJSON
}