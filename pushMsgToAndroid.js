var ALY = require('aliyun-sdk');

var push = new ALY.PUSH({
      accessKeyId: 'LTAIkd3XPg97uTID',
      secretAccessKey: 'Rd1pjbJ6SAPkdWl3zBLZyBUbgu9pPy',
      endpoint: 'http://cloudpush.aliyuncs.com',
      apiVersion: '2016-08-01'
    });

exports.push  = push;