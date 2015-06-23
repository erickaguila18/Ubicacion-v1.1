var express = require('express');
var path = require('path');
var http=require('http');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dbConfig = require('./db');
var mongoose = require('mongoose');
mongoose.connect(dbConfig.url);
var app = express();
var debug = require('debug')('passport-mongo');
var methodOverride = require('method-override');
app.set('port', process.env.PORT || 8080);
var server =  http.createServer(app);
var io = require('socket.io').listen(server);
server.listen(8080);


app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  }
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var passport = require('passport');
var expressSession = require('express-session');
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());
var flash = require('connect-flash');
app.use(flash());
var initPassport = require('./passport/init');
initPassport(passport);
var rutas = require('./rutas/index')(passport);
app.use('/', rutas);

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

var usernames = {};

io.sockets.on('connection', function (socket) {
    socket.on('sendchat', function (data) {
        io.sockets.emit('updatechat', socket.username, data);
    });

    socket.on('adduser', function(username){
        socket.username = username;
        usernames[username] = username;
        socket.emit('updatechat', 'Estado', 'Conectado');
        socket.broadcast.emit('updatechat', 'Servidor', username + ' se ha conectado');
        io.sockets.emit('updateusers', usernames);
    });

    socket.on('disconnect', function(){
        delete usernames[socket.username];
        io.sockets.emit('updateusers', usernames);
        socket.broadcast.emit('updatechat', 'Servidor', socket.username + ' se ha desconectado');
    });
});

module.exports = app;


