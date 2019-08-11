var express = require('express');
var STS = require('ali-oss').STS;
var co = require('co');
var fs = require('fs');
var app = express();
// var push = require('./pushMsgToAndroid')

var ALY = require('aliyun-sdk');

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
app.post("/sendMsg", function (req, res) {
  console.log("hello!!!")

  push.pushMessageToAndroid({
    AppKey: '27769675',
    Target: 'ACCOUNT', //推送目标: DEVICE:按设备推送 ALIAS : 按别名推送 ACCOUNT:按帐号推送  TAG:按标签推送; ALL: 广播推送
    TargetValue: '15521322687',
    Title: 'nodejs title',
    Body: 'push nodejs body'
  }, function (err, res) {
    console.log(err, res);
  });

})

app.listen(3000, function () {
  console.log('App started.');
});
