var express = require('express');
var STS = require('ali-oss').STS;
var co = require('co');
var fs = require('fs');
var app = express();
var ALY = require('aliyun-sdk');
var bodyParser = require('body-parser');

// var push = require('./pushMsgToAndroid')
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
next();
});
app.use(bodyParser.json()); //body-parser 解析json格式数据
// app.use(bodyParser.urlencoded({            //此项必须在 bodyParser.json 下面,为参数编码
//   extended: true
// }));


var push = new ALY.PUSH({
      accessKeyId: 'LTAIkd3XPg97uTID',
      secretAccessKey: 'Rd1pjbJ6SAPkdWl3zBLZyBUbgu9pPy',
      endpoint: 'http://cloudpush.aliyuncs.com',
      apiVersion: '2016-08-01'
    });

app.get('/', function (req, res) {
  var conf = JSON.parse(fs.readFileSync('./config.json'));
  var policy;
  if (conf.PolicyFile) {
    policy = fs.readFileSync(conf.PolicyFile).toString('utf-8');
  }

  var client = new STS({
    accessKeyId: conf.AccessKeyId,
    accessKeySecret: conf.AccessKeySecret,
  });

  co(function* () {
    var result = yield client.assumeRole(conf.RoleArn, policy, conf.TokenExpireTime);
    console.log(result);

    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-METHOD', 'GET');
    res.json({
      StatusCode: 200,
      AccessKeyId: result.credentials.AccessKeyId,
      AccessKeySecret: result.credentials.AccessKeySecret,
      SecurityToken: result.credentials.SecurityToken,
      Expiration: result.credentials.Expiration
    });
  }).then(function () {
    // pass
  }).catch(function (err) {
    console.log(err);
    res.status(err.statusCode);
    res.json({
      StatusCode: 500,
      ErrorCode: err.code,
      ErrorMessage: err.message
    });
  });
});

//透传
app.post("/sendMsg", function (req, sendRes) {
  console.log("hello!!!")
  var targetValue = req.body.targetId;
  var conent = req.body.msg;
  // var title = req.body.title;
  var title = "this is title"
  console.log("targetValue: "+targetValue+" content: "+conent+" title: "+title)
  push.pushMessageToAndroid({
    AppKey: '27769675',
    Target: 'ACCOUNT', //推送目标: DEVICE:按设备推送 ALIAS : 按别名推送 ACCOUNT:按帐号推送  TAG:按标签推送; ALL: 广播推送
    TargetValue: targetValue,
    Title: title,
    Body: JSON.stringify(conent)
  }, function (err, res) {
    if(err == null){
      sendRes.json({code:1,message:"ok",data:"success"})
    }
    console.log(err, res);
  });

})

app.listen(3000, function () {
  console.log('App started.');
});
