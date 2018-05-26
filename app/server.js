const express = require('express')
const formidable = require('express-formidable')
const fs = require('fs')
const MongoDB = require('mongodb')
// out own modules
const config = require('./config.json')
const helpers = require('./helpers.js')


const app = express()
const MongoClient = MongoDB.MongoClient

app.use(express.static('public'), formidable())
app.set('view engine', 'ejs')


// MONGO DB MONGO DB MONGO DB MONGO DB MONGO DB MONGO DB MONGO DB
var db = null
/* MongoDB Username */     var dbuser = config["database"]["username"]
/* MongoDB Password */     var dbpw = config["database"]["password"]
                              console.log('DBUser: ' + dbuser + " | DBPass: " + dbpw)
/* MongoDB URL */          var dburl = 'mongodb://' + dbuser + ':' + dbpw + '@ds016298.mlab.com:16298/grumblr'
/* MongoDB Database Name */var dbname = 'grumblr'


// create database connection
MongoClient.connect(dburl, {useNewUrlParser: true}, (err, client) => {
    if (err) 
      return console.log(err)

    db = client.db(dbname)

    app.listen(3000,() => {
        console.log('LISTENING TO PORT 3000!')
    })
})
// MONGO DB MONGO DB MONGO DB MONGO DB MONGO DB MONGO DB MONGO DB


// landing page - login
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// landing page - login
app.get('/index', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// register page
app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register.html')
})

// render profile page
app.get('/profile', (req, res) => {
    res.render('profile.ejs')
})

// render timeline
app.get('/timeline', (req, res) => {
    res.render('timeline.ejs')
})

// handles the login - render profile page
app.post('/handle_login', (req, res) => {
    // if succesful login
    res.render('profile.ejs')
})

// register page
app.post('/handle_registration', (req, res) => {
    res.sendFile(__dirname + '/registration_success.html')
})



app.post('/send_blog', (req, res) => {
    var utcMS = new Date().getTime()
    var username = "iamalexander"
    var text = null
    var imageJSON = null

    if (req.fields.blog_text) {
        var text = req.fields.blog_text
    }

    if (req.files.blog_image) {
        var image_name = req.files.blog_image.name
        var image_type = req.files.blog_image.type
        var image_path = req.files.blog_image.path
        var base64String = fs.readFileSync(image_path, {encoding: 'base64'})
        imageJSON = helpers.CreateImageJSON(image_name, image_type, base64String)
    } else {
        console.log('No file uploaded or detected.')
    }
    
    //let base64Image = base64String.split(';base64,').pop();
    //var utcDate = new Date(utcMS)

    var blogDocument = helpers.CreateBlogJSON(username, utcMS, text, imageJSON)
    //db.collection.insert()
    /*var writePath = 'uploaded/testImage.jpg'
    fs.writeFile(writePath, blogDocument.image.base64String, {encoding: 'base64'}, function(err) {
        console.log('File created');
    });*/
    res.render('profile.ejs')
})


// forbidden GETS
app.get('/handle_login', (req, res) => {
    // if succesful login
    res.redirect('/')
})

// register page
app.post('/registration_success', (req, res) => {
    res.redirect('/')
})


