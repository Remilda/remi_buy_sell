var http = require('http'),
    path = require('path'),
    methods = require('methods'),
    express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    cors = require('cors'),
    passport = require('passport'),
    errorhandler = require('errorhandler'),
    mongoose = require('mongoose');
    flash=require("connect-flash");
var isProduction = process.env.NODE_ENV === 'production';
const URL=require('url');
// Create global app object
var app = express();

app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
// Normal express config defaults
app.use(require('morgan')('dev'));
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());

app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({
  limit: '10mb',
  extended: true
}));

app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/uploads/products'));

app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));
app.use(flash());

if (!isProduction) {
  app.use(errorhandler());
}

if(isProduction){
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect('mongodb://localhost/craiglist', function(err, collection){
    if(!err){
      console.log('connected');
    }else{
      console.log(err);
    }
  });
  mongoose.set('debug', true);
}

require('./models/User');
require('./models/Auction');
require('./models/Category');
require('./models/Product');
require('./models/ProductImages');
require('./models/AuctionProducts');
require('./config/passport');

app.use(require('./routes'));

/// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use(function(err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({'errors': {
      message: err.message,
      error: err
    }});
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({'errors': {
    message: err.message,
    error: {}
  }});
});

passport.serializeUser(function(user, done) {
    console.log('serializeUser: ' + user._id)
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    db.users.findById(id, function(err, user){
        console.log(user)
        if(!err) done(null, user);
        else done(err, null)
    })
});

// finally, let's start our server...
var server = app.listen( process.env.PORT || 3000, function(){
  console.log('Listening on port ' + server.address().port);
});
