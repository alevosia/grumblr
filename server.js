//server.js (root directory)

// call the packages we need
var express         = require('express');                                   // call express
var mongoose        = require('mongoose').set('debug', true);               // schema and database connection
var app             = express();                                            // define our app using express
var port            = process.env.PORT || 8080;                             // set our port
var authRouter      = express.Router();
var secureRouter    = express.Router();  
var session         = require('express-session');
var bodyParser      = require('body-parser');
var morgan          = require('morgan');
var passport        = require('passport');
var flash           = require('connect-flash');
var MongoStore      = require('connect-mongo')(session);
var multer          = require('multer');

// PASSPORT CONFIGURATION - for authentication
// ======================================================================================
require('./config/passport.js')(passport);

// APPLICATION CONFIGURATION
// ======================================================================================
app.use(express.static('public'));                  // for serving files from public folder
app.use(morgan('dev'));                             // for logging traffic in our app
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(multer({dest: '/uploads/'}).any());               
app.use(session({
    secret: 'anystringoftext',
    saveUninitialized: true,                        // allow persistence event at server restart if there's a persistence layer
    resave: true,                                   // enable resaving of session even without changes
    store: new MongoStore({mongooseConnection: mongoose.connection,
                        ttl: 3 * 24 * 60 * 60 })    // (1 hour) max session timeout in seconds
}));
app.use(passport.initialize());
app.use(passport.session());                        // uses the session above
app.use(flash());                                   // for displaying messages on successful/failed authentication

// ROUTES FOR OUR APPLICATION
// ======================================================================================
// authentication router for unauthenthicated access 
require('./app/routes/auth.js')(authRouter, passport);
app.use('/auth', authRouter);
// secured router when user has logged in (authenticated access)
require('./app/routes/secure.js')(secureRouter, passport);
app.use('/', secureRouter);                                 

app.set('view engine', 'ejs')                       // sets the view for the templating engine for rendering dynamic html
console.log('Application configured!')

// DATABASE CONFIGURATION AND CONNECTION
// ======================================================================================
var configDB = require('./config/database.js');
mongoose.connect(configDB.url, function(err) {
    if (err) return console.log(err);
    console.log('Connected to database!');
    app.listen(port);                   // start listening to port
    console.log('Application is now listening to port ' + port);
})