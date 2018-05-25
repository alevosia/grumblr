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

MongoClient.connect(dburl, (err, client) => {
    if (err) return console.log(err)
    db = client.db('grumblr')

    app.listen(3000, () => {
        console.log('Listening to 3000!')
    })
})

// landing page - login
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
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
app.post('handle_login', (req, res) => {
    res.sendFile(__dirname + '/profile.html')
})