var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var router = express.Router();

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

//Social Media Frameworks

var Twitter = require('./libraries/twitter_fetch.js')
var Instagram = require('./libraries/instagram_fetch.js')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* GET home page. */
app.use('/fetch', function(req, res, next) {
  switch (req.body.type) {
    case undefined :
        res.send("No social network type specified");
        break;
    case "":
        res.send("No social network type specified");
        break;
    case 'twitter':
            var twitterVals = {
              bearer_token: req.body.bearer_token,
              searchTerm: req.body.searchTerm,
              fetchCount: req.body.fetchCount,
              latestID: req.body.latestID
            }
            Twitter.fetch(twitterVals, function(returnValue) {
              res.json(returnValue);
            });
        break;
    case 'instagram':
            var instagramVals = {
              //bearer_token: req.body.bearer_token,
              searchTerm: req.body.searchTerm,
              fetchCount: req.body.fetchCount,
              latestID: req.body.latestID,
              clientID: req.body.clientID
            }
            Instagram.fetch(instagramVals, function(returnValue) {
              res.json(returnValue);
            });
        break;
    case 'vine':
    
        break;
    default:
        res.send("No know social network of type " + req.body.type);
        break;
  }

});

app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/* GET home page. */
app.use('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
