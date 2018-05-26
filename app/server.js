const config = require('./config.json')
const express = require('express')
const formidable = require('express-formidable')
const MongoDB = require('mongodb')

const app = express()
const MongoClient = MongoDB.MongoClient

app.use(express.static('public'), formidable())


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

// register page
app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register.html')
})

// profile page
app.get('/profile', (req, res) => {
    res.sendFile(__dirname + '/profile.html')
})

// timeline
app.get('/timeline', (req, res) => {
    res.sendFile(__dirname + '/timeline.html')
})

// handles the login
app.post('/handle_login', (req, res) => {
    // if succesful login
    res.redirect('/profile')
})

// register page
app.post('/handle_registration', (req, res) => {
    res.sendFile(__dirname + '/registration_success.html')
})

app.post('/send_blog', (req, res) => {
    console.log(req.fields.blog_text)
    console.log(req.files.blog_image)
    res.redirect('/profile')
})


// forbidden GETS
app.get('/handle_login', (req, res) => {
    // if succesful login
    res.redirect('/')
})


