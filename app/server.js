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
var dburl = 'mongodb://' + dbuser + ':' + dbpw + '@ds014648.mlab.com:14648/tumblr'

/*MongoClient.connect(dburl, (err, client) => {
    if (err) return console.log(err)

    db = client.db('star-wars-quotes')
    
})*/

app.listen(3000, function () {
    console.log('Listening to 3000!')
})

// landing page - login
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// profile page
app.get('/profile.html', (req, res) => {
    res.sendFile(__dirname + '/profile.html')
})

// timeline
app.get('/timeline.html', (req, res) => {
    res.sendFile(__dirname + '/timeline.html')
})

// handles the post
app.post('form name', (req, res) => {
    /*db.collection('quotes').save(req.body, (err, result) => {
        if (err) return console.log(err)
    
        console.log('saved to database')
        res.redirect('/')
    })*/
})