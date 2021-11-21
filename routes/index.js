var express = require('express');
var mysql = require('mysql');
var path = require('path');
var log4js = require('log4js');
const { render } = require('ejs');
const { Console } = require('console');
const session = require('express-session');
const fs = require('fs');
var passport = require('passport');

// Infomations of database
const connection = mysql.createConnection({
  host: 'us-cdbr-east-04.cleardb.com',
  user: 'b20f0b5811dcf3',
  password: '2e170047',
  database: 'heroku_8f451d7112f306c'
});

//Connection to Database
connection.connect(function (err) {
  if (err) throw err;
  console.log('Connected');
});


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
defaultLogger.info('infomation');
// debugLogger.warn('warning!!!');

//デバッグ用のログ
const debugLogger = log4js.getLogger('debug');
// debugLogger.debug('debugging');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var router = express.Router();

//Global Valiable
let date = new Date(Date.now());
let now = formatDate(date, 'yyyy-MM-dd');
let globalResBody;
let globalGameId;


//ログイン認証
let isLogined = function (req, res, next) {
  console.log(JSON.stringify(req.session, null, 2));
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
};

/* 
Method : GET
Path : /
Description : 初期ページ
*/
router.get('/', isLogined, function (req, res, next) {

  debugLogger.debug('=============================');
  debugLogger.debug('Method : GET');
  debugLogger.debug('URL : /');
  debugLogger.debug('session : ' + JSON.stringify(req.session, null, 2));
  debugLogger.debug('=============================');

  let err = '';
  res.render('index', { error: err });
});


/* 
Method : GET
Path : /games_history
Description : 
*/
router.get('/games_history', isLogined, function (req, res, next) {

  debugLogger.debug('=============================');
  debugLogger.debug('Method : GET');
  debugLogger.debug('URL : /games_history');
  debugLogger.debug('session : ' + JSON.stringify(req.session, null, 2));
  debugLogger.debug('=============================');

  //sessionのクリア
  // req.session.destroy();

  let gamesObject = {};
  let gamesList = [];
  let playersObject = {};
  let playerList = [];

  let SelectAllPlayersAndGameInnerJoin =
    `SELECT * FROM players JOIN game ON players.game_id = game.id ORDER BY game.date`;

  connection.query(SelectAllPlayersAndGameInnerJoin, function (err, results, fields) {

    if (err) { throw err };

    for (const result of results) {

      //========================Gameのオブジェクト作成========================
      let dateAAA = new Date(result['date']);
      let datetime = formatDate(dateAAA, 'yyyy-MM-dd');

      gamesObject = {
        gameId: result['game_id'],
        date: datetime,
        opponent: result['opponent']
      };

      gamesList.push(gamesObject);
      //======================================================================

      //========================Playerのオブジェクト作成========================

      playersObject = {
        batting_order: result['batting_order'],
        name: result['name'],
        box_1: result['box_1'],
        box_2: result['box_2'],
        box_3: result['box_3'],
        box_4: result['box_4'],
        box_5: result['box_5'],
        box_6: result['box_6'],
        box_7: result['box_7'],
        box_8: result['box_8'],
        box_9: result['box_9'],
        box_10: result['box_10'],
        gameId: result['game_id']
      }

      playerList.push(playersObject);
      //======================================================================
    }

    // 重複を取り除く処理
    let gamesListMarged = gamesList.filter((element, index, self) =>
      self.findIndex(e =>
        e.gameId === element.gameId &&
        e.date === element.date &&
        e.opponent === element.opponent
      ) === index
    );

    //GameとPlayerをガッチャンコ
    gamesListMarged.forEach((object1, index1) => {
      let playerResultList = [];
      playerList.forEach((object2, index2) => {
        if (object2.gameId == object1.gameId) {
          playerResultList.push(object2);
          gamesListMarged[index1].playerResult = playerResultList;
        }
      });
    });

    let responseBody = {
      gamesList: gamesListMarged
    };

    res.render('game_history', responseBody);

  });
});


/* 
Method : GET
Path : /scorebook/:gameId
Description : 
*/
router.get('/scorebook/:gameId', isLogined, function (req, res, next) {

  debugLogger.debug('=============================');
  debugLogger.debug('Method : GET');
  debugLogger.debug(`URL : /scorebook/${req.params.gameId}`);
  debugLogger.debug('session : ' + JSON.stringify(req.session, null, 2));
  debugLogger.debug('=============================');

  let resBody = [];
  let battingOrder;
  let gameId = req.params.gameId;

  req.session.gameInfo = { gameId: gameId };

  let getAllBoxResultSql =
    `SELECT * FROM players WHERE game_id = ${gameId} ORDER BY batting_order ASC`;

  connection.query(getAllBoxResultSql, function (err, result, fields) {
    if (err) { throw err };

    // console.log(JSON.stringify(result, null, 2));

    for (const iterator of result) {

      battingOrder = {
        order: iterator.batting_order,
        position: iterator.position,
        name: iterator.name,
        box_1: iterator.box_1,
        box_2: iterator.box_2,
        box_3: iterator.box_3,
        box_4: iterator.box_4,
        box_5: iterator.box_5,
        box_6: iterator.box_6
      };
      resBody.push(battingOrder);

    }

    //global変数への格納(resBody)
    if (!globalResBody) {
      globalResBody = resBody;
    }

    console.table(globalResBody);

    let responseBody = {
      playersList: resBody
    }

    res.render('scorebook', responseBody);
  });
});

/* 
Method : POST
Path : /members
Description : 
*/
router.post('/members', isLogined, function (req, res, next) {

  debugLogger.debug('=============================');
  debugLogger.debug('Method : POST');
  debugLogger.debug('URL : /members');
  debugLogger.debug('session : ' + JSON.stringify(req.session, null, 2));
  debugLogger.debug('Req Body : ' + JSON.stringify(req.body, null, 2));
  debugLogger.debug('=============================');

  let dateItem = req.body.date_hidden;
  let opponentItem = req.body.opponent;

  if (opponentItem) {
    req.session.gameInfo = {
      date: dateItem,
      opponent: opponentItem
    };
    // console.table(req.body);
    // console.table(req.session);

    let insertGameSql =
      `INSERT INTO game VALUES(0,"${dateItem}","${opponentItem}")`;

    connection.query(insertGameSql, function (err, result, fields) {
      if (err) {
        throw err;
      } else {
        console.log("Insert completed.");
        req.session.gameInfo.gameId = result.insertId;
        // console.table(result);
        // console.log(req.session.gameInfo.gameId);
        // console.table(req.session);
      }
      res.render('members', req.body);
    });

  } else {
    var err = '対戦相手を入力してください。';
    res.render('index', { error: err });
  }

});


/* 
Method : POST
Path : /scorebook
Description : 
*/
router.post('/scorebook', isLogined, function (req, res, next) {

  debugLogger.debug('=============================');
  debugLogger.debug('Method : POST');
  debugLogger.debug('URL : /scorebook');
  debugLogger.debug('session : ' + JSON.stringify(req.session, null, 2));
  debugLogger.debug('Req Body : ' + JSON.stringify(req.body, null, 2));
  debugLogger.debug('=============================');

  let resBody = [];
  let gameId = req.session.gameInfo.gameId;
  let insertValues = '';
  let battingOrder;

  for (let i = 1; i < 10; i++) {
    let position = req.body[`position-${i}`];
    let name = req.body[`name-${i}`];
    insertValues += `("${i}","${position}","${name}",${gameId},"","","","","","","","","","")`;

    if (i < 9) {
      insertValues += ',';
    }

    battingOrder = {
      order: i,
      position: position,
      name: name,
      box_1: '',
      box_2: '',
      box_3: '',
      box_4: '',
      box_5: '',
      box_6: ''
    };
    resBody.push(battingOrder);
  }

  //global変数への格納(resBody)
  globalResBody = resBody;

  let insertFullSentence = 'INSERT INTO players VALUES' + insertValues;

  //データベースへの登録
  connection.query(insertFullSentence, function (err, result, fields) {
    if (err) {
      throw err;
    } else {
      console.log("Insert completed.")
    }

    let responseBody = {
      playersList: resBody
    }

    res.render('scorebook', responseBody);
  });
  // });
});


/* 
Method : POST
Path : /batterBox?boxId=${num}
Description : 
*/
router.post('/batterBox', isLogined, function (req, res, next) {

  debugLogger.debug('=============================');
  debugLogger.debug('Method : POST');
  debugLogger.debug(`URL : /batterBox?boxId=${req.query.boxId}`);
  debugLogger.debug('session : ' + JSON.stringify(req.session, null, 2));
  debugLogger.debug('Req Body : ' + JSON.stringify(req.body, null, 2));
  debugLogger.debug('=============================');

  //クエリパラメータ解析
  let boxId = req.query.boxId;
  let numArr = boxId.split('-');
  let boxNum = numArr[1];

  //リクエストボディ解析
  let orderNo = req.body.orderNum;
  let playerName = req.body.playerName;

  //sessionからgameIdを取得
  let gameId = req.session.gameInfo.gameId;

  let getBoxResultSql =
    `SELECT box_${boxNum} 
          FROM players 
          WHERE batting_order = ${orderNo} 
          AND game_id = ${gameId}`;

  connection.query(getBoxResultSql, function (err, result, fields) {

    if (err) {
      console.log("err2" + err);
      throw err
    };

    let responseBody = {
      batterInfo: [
        {
          orderNo: orderNo,
          playerName: playerName,
          boxNum: boxNum,
          boxResult: result[0][`box_${boxNum}`]
        }
      ]
    }
    res.render('batterBox', responseBody);

  });
});

/* 
Method : GET
Path : /player?order=${order number}&name=${player name}
Description : 
*/
router.get('/player', isLogined, function (req, res, next) {

  //クエリパラメータ解析
  let orderNum = req.query.order;
  let playerName = req.query.name;

  debugLogger.debug('=============================');
  debugLogger.debug('Method : GET');
  debugLogger.debug(`URL : /player&order=${orderNum}&name=${playerName}`);
  debugLogger.debug('session : ' + JSON.stringify(req.session, null, 2));
  debugLogger.debug('=============================');

  //sessionからgameIdを取得
  let gameId = req.session.gameInfo.gameId;

  let getPlayerInfoSql =
    `SELECT position FROM players WHERE batting_order = ${orderNum} AND name = "${playerName}" AND game_id = ${gameId}`;

  connection.query(getPlayerInfoSql, function (err, result, fields) {

    if (err) {
      console.log("err" + err);
      throw err
    };

    let responseBody = {
      playerInfo: [
        {
          orderNo: orderNum,
          playerName: playerName,
          position: result[0]['position']
        }
      ]
    }
    res.render('player', responseBody);

  });
});


/* 
Method : PUT
Path : /scorebook
Description : 
*/
router.put('/scorebook', isLogined, function (req, res, next) {

  debugLogger.debug('=============================');
  debugLogger.debug('Method : PUT');
  debugLogger.debug('URL : /scorebook');
  debugLogger.debug('session : ' + JSON.stringify(req.session.gameInfo, null, 2));
  debugLogger.debug('Query Param : ' + JSON.stringify(req.params, null, 2));


  let boxResult = req.body.result;
  let orderNo = req.body.orderNum;
  let boxNo = req.body.boxNum;
  let changeFlag = parseInt(req.body.changeFlag);
  let resBody = globalResBody.slice();
  let gameId = req.session.gameInfo.gameId;

  debugLogger.debug('changeFlag : ' + changeFlag);
  debugLogger.debug('boxResult : ' + boxResult);
  debugLogger.debug('=============================');

  //打席結果が未変更の場合
  if (!changeFlag) {

    resBody[orderNo - 1][`box_${boxNo}`] = boxResult;

    let responseBody = {
      playersList: resBody
    };

    // res.render('scorebook', responseBody);
    res.redirect(`scorebook/${gameId}`);

    //打席結果が変更された場合
  } else {

    //打席結果の登録
    let updateValues =
      `UPDATE players SET box_${boxNo} = "${boxResult}" WHERE game_id = ${gameId} AND batting_order = ${orderNo}`;

    connection.query(updateValues, function (err, result, fields) {

      if (err) { throw err };

      resBody[orderNo - 1][`box_${boxNo}`] = boxResult;

      let responseBody = {
        playersList: resBody
      }

      console.log(JSON.stringify(resBody, null, 2));

      // res.render('scorebook', responseBody, err);
      res.redirect(`scorebook/${gameId}`);
    });
  }
});


/* 
Method : POST
Path : /change
Description : 
*/
router.post('/change', isLogined, function (req, res, next) {

  debugLogger.debug('=============================');
  debugLogger.debug('Method : POST');
  debugLogger.debug('URL : /change');
  debugLogger.debug('session : ' + JSON.stringify(req.session, null, 2));
  debugLogger.debug('Req Body : ' + JSON.stringify(req.body, null, 2));
  debugLogger.debug('=============================');

  let reqPlayerName = req.body.name;
  let reqPosition = req.body.position;
  let reqOrder = req.body.order;
  let changeNameFlag = req.body.changeNameFlag;
  let changePositionFlag = req.body.changePositionFlag;
  // let resBody = globalResBody.slice();
  let resBody = [];
  let gameId = req.session.gameInfo.gameId;


  //選手交代の場合
  if (changeNameFlag == 1) {

    //まず交代される側の選手の打順を-${打順}にする
    let minusChangedPlayerOrderSql =
      `UPDATE players SET batting_order = -${reqOrder} WHERE game_id = ${gameId} AND batting_order = ${reqOrder}`;

    connection.query(minusChangedPlayerOrderSql, function (err, result, fields) {
      if (err) { throw err }

      //そして交代後の選手を登録
      let insertNewPlayerSql =
        `INSERT INTO players VALUES
      (${reqOrder},"${reqPosition}","${reqPlayerName}",${gameId},"","","","","","","","","","")`;

      connection.query(insertNewPlayerSql, function (err, result, fields) {
        if (err) { throw err }

        let selectAllPlayersSql =
          `SELECT * FROM players WHERE game_id = ${gameId} ORDER BY batting_order ASC`

        connection.query(selectAllPlayersSql, function (err, result, fields) {
          if (err) { throw err }

          for (const iterator of result) {
            battingOrder = {
              order: iterator.batting_order,
              position: iterator.position,
              name: iterator.name,
              box_1: iterator.box_1,
              box_2: iterator.box_2,
              box_3: iterator.box_3,
              box_4: iterator.box_4,
              box_5: iterator.box_5,
              box_6: iterator.box_6
            };
            resBody.push(battingOrder);
          }

          let responseBody = {
            playersList: resBody
          }
          res.render('scorebook', responseBody);
        });
      });
    });

  } else if (changePositionFlag == 1) {
    //ポジション変更の場合

    let updateNewPositionSql =
      `UPDATE players SET position = "${reqPosition}" WHERE game_id = ${gameId} AND batting_order = ${reqOrder}`;

    connection.query(updateNewPositionSql, function (err, result, fields) {
      if (err) { throw err };

      let selectAllPlayersSql =
        `SELECT * FROM players WHERE game_id = ${gameId} ORDER BY batting_order ASC`

      connection.query(selectAllPlayersSql, function (err, result, fields) {
        if (err) { throw err }

        for (const iterator of result) {
          battingOrder = {
            order: iterator.batting_order,
            position: iterator.position,
            name: iterator.name,
            box_1: iterator.box_1,
            box_2: iterator.box_2,
            box_3: iterator.box_3,
            box_4: iterator.box_4,
            box_5: iterator.box_5,
            box_6: iterator.box_6
          };
          resBody.push(battingOrder);
        }

        let responseBody = {
          playersList: resBody
        }
        res.render('scorebook', responseBody);
      });
    });

  } else {
    let responseBody = {
      playersList: resBody
    }
    res.render('scorebook', responseBody);
  }

});

/* 
Method : GET
Path : /back
Description : 
*/
router.get('/back', isLogined, function (req, res, next) {

  debugLogger.debug('=============================');
  debugLogger.debug('Method : GET');
  debugLogger.debug('URL : /back');
  debugLogger.debug('session : ' + JSON.stringify(req.session, null, 2));
  debugLogger.debug('=============================');

  let gameId = req.session.gameInfo.gameId;

  res.redirect(`scorebook/${gameId}`)

})

//日付のフォーマッター
function formatDate(date, format) {
  format = format.replace(/yyyy/g, date.getFullYear());
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2));
  format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
  format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3));
  return format;
};


module.exports = router;

