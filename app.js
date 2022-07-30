'use strict';

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const methodOverride = require('method-override');
var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
const bcrypt = require('bcrypt');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var usersRouter = require('./routes/users');
const { Console } = require('console');

// // Infomations of database
// const connection = mysql.createConnection({
//   host: 'us-cdbr-east-04.cleardb.com',
//   user: 'b20f0b5811dcf3',
//   password: '2e170047',
//   database: 'heroku_8f451d7112f306c'
// });

// // Connection to Database
// connection.connect(function (err) {
//   if (err) throw err;
//   console.log('Connected');
// });

var app = express();

// let db_config = {
//         host: 'localhost',
//         user: 'root',
//         password: 'root',
//         database: 'baseball_score'
//     }
let db_config = {
    host: 'us-cdbr-east-04.cleardb.com',
    user: 'b20f0b5811dcf3',
    password: '2e170047',
    database: 'heroku_8f451d7112f306c'
}

let connection;

function handleDisconnect() {
    console.log('INFO.CONNECTION_DB: ');
    connection = mysql.createConnection(db_config);

    //connection取得
    connection.connect(function(err) {
        if (err) {
            console.log('ERROR.CONNECTION_DB: ', err);
            // setTimeout(handleDisconnect, 1000);
            setTimeout(handleDisconnect, 180 * 60 * 8 * 1000);
        }
    });

    //error('PROTOCOL_CONNECTION_LOST')時に再接続
    connection.on('error', function(err) {
        console.log('ERROR.DB: ', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('ERROR.CONNECTION_LOST: ', err);
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();

const port = process.env.PORT || 3000;
var server = app.listen(port, function() {
    console.log("Node.js is listening to PORT:" + server.address().port);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method'));


//session情報
app.use(session({
    secret: 'ask6fb98w8wh958yexkb',
    resave: false,
    saveUninitialized: false,
    cookie: {
        //セッション寿命=1日
        maxAge: 180 * 60 * 8 * 1000
    }
}));
app.use(passport.initialize());
app.use(passport.session());

//app.js
passport.use(new LocalStrategy({
    userNameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, username, password, done) {
    process.nextTick(function() {
        //処理書く
        let getLoginInfoSql = `SELECT * FROM users WHERE id = "${username}"`;

        connection.query(getLoginInfoSql, function(err, results, fields) {

            if (err) { throw err };

            for (const iterator of results) {
                let hash_pass = iterator.password;
                if (bcrypt.compareSync(password, hash_pass)) {
                    console.log("username : " + username)
                    return done(null, username);
                }
            }

            return done(null, false, { message: 'ID or Password is incorrect' });
        });
    })
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.log('error : ' + err);
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;