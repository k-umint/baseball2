var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var path = require('path');
var log4js = require('log4js');
const passport = require('passport');
const flash = require('connect-flash');

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


router.get('/', function (req, res, next) {
  debugLogger.debug('=============================');
  debugLogger.debug('Method : GET');
  debugLogger.debug('URL : /login');
  debugLogger.debug('session : ' + JSON.stringify(req.session, null, 2));
  debugLogger.debug('=============================');

  let err = req.flash('error');
  console.log("error : " + err)
  res.render('login', { error: err });
})


router.post('/', passport.authenticate('local',
  {
    successRedirect: '/',　//ログイン成功時に遷移したい画面
    failureRedirect: '/login', //ログイン失敗時に遷移したい画面
    session: true,
    failureFlash: true
  }
))

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
