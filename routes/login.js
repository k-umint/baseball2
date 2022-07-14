var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var path = require('path');
var log4js = require('log4js');
const passport = require('passport');
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
var nodemailer = require("nodemailer");
const { Console } = require('console');

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
    // connection = mysql.createPool(db_config);

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

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var router = express.Router();
router.use(flash());

//ログファイル出力
var logDirectory = path.join(__dirname, './log');

//ログ設定
log4js.configure({
    appenders: {
        index: { type: 'file', filename: logDirectory + '/index.log' },
        debug: { type: 'file', filename: logDirectory + '/debug.log' }
    },
    categories: {
        default: { appenders: ['index'], level: 'info' },
        debug: { appenders: ['debug'], level: 'debug' },
    }
});

//情報出力用のログ
const defaultLogger = log4js.getLogger();
// defaultLogger.info('infomation');

//デバッグ用のログ
const debugLogger = log4js.getLogger('debug');

/* 
Method : GET
Path : /login
Description : 
*/
router.get('/', function(req, res, next) {
    debugLogger.debug('=============================');
    debugLogger.debug('Method : GET');
    debugLogger.debug('URL : /login');
    debugLogger.debug('session : ' + JSON.stringify(req.session, null, 2));
    debugLogger.debug('cookie : ' + JSON.stringify(req.cookies, null, 2));
    debugLogger.debug('=============================');

    // res.cookie('test', 'aaa', { maxAge: 60000, httpOnly: false });

    let err = req.flash('error');

    console.log("error : " + err);
    res.render('login', {
        error: err,
        userId: "-----"
    });
});

/* 
Method : POST
Path : /login
Description : 
*/
router.post('/', passport.authenticate('local', {
    successRedirect: '/', //ログイン成功時に遷移したい画面
    failureRedirect: '/login', //ログイン失敗時に遷移したい画面
    session: true,
    failureFlash: true
}));

/* 
Method : GET
Path : /login/logout
Description : 
*/
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

/* 
Method : GET
Path : /login/regist
Description : 
*/
router.get('/regist', function(req, res) {

    let err = req.flash('error');

    res.render('regist', {
        error: err,
        userId: "-----"
    });
});

/* 
Method : POST
Path : /login/signup
Description : 
*/
router.post('/signup', function(req, res) {

    let id = req.body.userId;
    let password = req.body.password;
    let hashedPass = hashing(password);
    let token = createToken();
    let hashedToken = hashing(token);

    let selectSameUsernamefromUserTmp = `SELECT * FROM users_tmp WHERE id = "${id}"`;

    connection.query(selectSameUsernamefromUserTmp, function(err, results, fields) {
        if (err) { console.log(err) };

        console.log(results)
        if (results.length) {
            let err = "他のユーザーが現在登録作業中です。<br>違うアドレスを入力してください。";
            res.render('regist', {
                error: err,
                userId: "-----"
            });

        } else {
            let selectSameUsernamefromUser = `SELECT * FROM users WHERE id = "${id}"`;
            connection.query(selectSameUsernamefromUser, function(err, results, fields) {
                if (err) { console.log(err) };

                if (results.length > 0) {
                    let err = "他のユーザーが現在使用中です。<br>違うアドレスを入力してください。";
                    res.render('regist', {
                        error: err,
                        userId: "-----"
                    });

                } else {
                    //SMTPサーバの設定(Outlookからの送信設定)
                    var smtp = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 587,
                        auth: {
                            user: "baseballscore.info@gmail.com",
                            pass: "ntdzejjcmwfivtxi"
                        }
                    });

                    //メール情報の作成
                    var message = {
                        from: 'baseballscore.info@gmail.com',
                        to: id,
                        subject: 'Batting Results - メール認証',
                        html: `<p>以下のリンクからアカウントの確認を行ってください｡</p><br>
            <a href="https://baseball-score-keysers.herokuapp.com/login/signup/${token}" >メール認証を完了する</a>`
                    };

                    // var message = {
                    //   from: 'baseballscore.info@gmail.com',
                    //   to: id,
                    //   subject: 'Batting Results - メール認証',
                    //   text: 'テストメールです。',
                    //   html: `<p>以下のリンクからアカウントの確認を行ってください｡</p><br>
                    //   <a href="http://localhost:3000/login/signup/${token}" >メール認証を完了する</a>`
                    // };

                    smtp.sendMail(message, function(error, info) {

                        if (error) {
                            console.log("Failed to send E-mail.");
                            console.log(error);
                            return
                        } else {
                            console.log("Succeed to send E-mail.");
                            console.log(info);

                            let registerToUsersTmp =
                                `INSERT INTO users_tmp VALUES("${id}","${hashedPass}","${hashedToken}")`;

                            connection.query(registerToUsersTmp, function(err, results, fields) {

                                if (err) {
                                    console.log(err);
                                }
                            });
                        }
                    })
                    res.render('regist_message', { userId: "-----" });
                }
            });
        }
    });
});


/* 
Method : GET
Path : /login/signup/:token
Description : 
*/
router.get('/signup/:token', function(req, res) {

    let paramToken = req.params.token;

    let selectTokenFromUsersTmp = `SELECT * FROM users_tmp`;

    connection.query(selectTokenFromUsersTmp, function(err, results) {

        if (err) { console.log(err) }

        for (const iterator of results) {

            let id = iterator.id;
            let password = iterator.password;
            let hashedDBToken = iterator.token;

            // if (hashedParamToken === hashedDBToken) {
            if (bcrypt.compareSync(paramToken, hashedDBToken)) {

                let registerToUser = `INSERT INTO users VALUES("${id}","${password}")`;

                // usersテーブルに登録(本登録)
                connection.query(registerToUser, function(err, results) {
                    if (err) { console.log(err) }

                    let deleteUserTmpRecord = `DELETE FROM users_tmp WHERE id = "${id}"`;

                    //users_tmpにあるレコードを削除
                    connection.query(deleteUserTmpRecord, function(err, results) {
                        if (err) { console.log(err) }

                        let errText = null;
                        res.render('login', {
                            error: errText,
                            userId: "-----"
                        });
                    })

                })

            } else {
                console.error("トークン認証に失敗しました。");
                console.error("トークン : " + paramToken);
            }
        }
    })

})


// ハッシュ化
function hashing(data) {
    const hashed_password = bcrypt.hashSync(data, 10);
    return hashed_password;
}

//　トークン生成
function createToken() {
    // 生成する文字列の長さ
    var l = 10;
    // 生成する文字列に含める文字セット
    var c = "ABCDEFGHIJELMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var cl = c.length;
    var r = "";
    for (var i = 0; i < l; i++) {
        r += c[Math.floor(Math.random() * cl)];
    }
    return r;
}


module.exports = router;