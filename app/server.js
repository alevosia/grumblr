const config = require('./config.json')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoDB = require('mongodb')
const MongoClient = MongoDB.MongoClient

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

var db = null
var dbuser = config["database"]["username"]
var dbpw = config["database"]["password"]
console.log('DBUser: ' + dbuser + " | DBPass: " + dbpw)
var dburl = 'mongodb://' + dbuser + ':' + dbpw + '@ds016298.mlab.com:16298/grumblr'

MongoClient.connect(dburl, {useNewUrlParser: true}, (err, client) => {
    if (err) return console.log(err)
    db = client.db('grumblr')

    app.listen(3000,() => {
        console.log('Listening to 3000!')
    })
})

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

// forbidden GETS
app.get('/handle_login', (req, res) => {
    // if succesful login
    res.redirect('/')
    res.send('Woops!')
})