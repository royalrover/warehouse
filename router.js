/**
 * Created by yuxiu1 on 15/7/10.
 */
var express = require('express'),
    router = express.Router(),
    fs = require("fs"),
    path = require('path'),
      // https://github.com/andrewrk/node-multiparty/
    multiparty = require('multiparty'),
    template = require('art-template');

template.config('extname', '.html');
router.post('/uploadTar',function(req,res){
    var uploadType = req.query && req.query.uploadType;
    var fileName = req.query && req.query.fileName;
    var form = new multiparty.Form({uploadDir: './upload/spon/'});
    form.parse(req, function(err, fields, files) {
        var filesTmp = JSON.stringify(files, null, 2);
        if (err) {
            console.log('parse error: ' + err);
        } else {
            var inputFile = files[fileName][0];
            var uploadedPath = inputFile.path;
            var dstPath = './upload/spon/' + encodeURIComponent(inputFile.originalFilename);
            fs.rename(uploadedPath, dstPath, function (err) {
                if (err) {
                    console.log('rename error: ' + err);
                } else {
                    res.writeHead(200, {'content-type': 'application/json;encoding:utf-8'});
                    res.end(JSON.stringify({
                        success: true
                    }));
                }
            });
        }
    });
});

router.get('/',function(req,res){
    res.redirect('/codes');
});

router.get('/codes',function(req,res){
    // 在OS X下目录中存在隐藏文件.DS_Store，会影响构建
    var checkDirsExceptDSStore = function(dirs){
        var nameReg = /^[a-z0-9]/i;
        var ret = [];
        dirs.forEach(function(v,i){
            if(v.match(nameReg)){
                ret.push(v);
            }
        });
        return ret;
    };
    var tars = fs.readdirSync(path.join(process.cwd(),'upload/spon'));
    tars = checkDirsExceptDSStore(tars);
    var ret = cache.downloadRender({
        tars: tars.reverse()
    });

    res.end(ret);

});

router.get('/download/:version',function(req,res){
   // 下载对应版本的源码
    var options = {
        root: process.cwd() + '/upload/spon/',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    var fileName = req.params.version;
    res.sendFile(fileName, options, function (err) {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
        else {
            console.log('Sent:', fileName);
        }
    });
});

exports.router = router;