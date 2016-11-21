var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var exphbs  = require('express-handlebars');
var session = require('express-session');

var helpers = require('./lib/helpers');
var idea_routes = require('./routes/idea_routes');

////////////////////////////////////////////////////////////////
// DATABASE SETUP
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGODB_URI || 'mongodb://localhost/mymongodb');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("database connected");
});
///////////////////////////////////////////////////////////////

var app = express();

app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    helpers: helpers,
}));

app.set('view engine', 'handlebars');

app.use(cookieParser());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static('public'));
app.use("/semantic", express.static('semantic'));

// set up a secret to encrypt cookies
app.use(session({ secret : '6170', resave : true, saveUninitialized : true }));

app.use('/', board_routes);

////////////////////////////////////////////////////////////////
// ERROR HANDLING

app.use(function(req, res, next) {
    // 404 error
    res.status(404);
    res.render('error', {error: 'Page Not Found'});
});

app.use(function(req, res, next) {
    res.status(500);
    res.render('error', {error: 'Unknown Error'});
});

///////////////////////////////////////////////////////////////

app.listen(process.env.PORT || 3000);

module.exports = app;
