var ALY = require('aliyun-sdk');

var push = new ALY.PUSH({
      accessKeyId: '222222',
      secretAccessKey: '11111111',
      endpoint: 'http://cloudpush.aliyuncs.com',
      apiVersion: '2016-08-01'
    });

exports.push  = push;
