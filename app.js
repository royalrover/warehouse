/**
 * Created by yuxiu1 on 15/7/10.
 */
var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    bp = require('body-parser'),
    logger = require('morgan'),
    staticPath = require('static'),
    template = require('art-template');
var router = require('./router').router;
var app = express();
//设置开发模式，production 和 development！！！
app.set('env','production');

cache = {
  downloadRender: template.compile(fs.readFileSync('view/download.html','utf8'))
};

app.use(logger('dev'));
app.use(express.static(path.join(__dirname,'upload')));
app.use(bp.json());
app.use(bp.urlencoded());
app.use(router);
app.listen(8110,function(){
    console.log('node is listening...');
});