var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require("fs");

app.use(express.static('www'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//设置静态首页
app.get('/',function(req, res){
    fs.readFile('www/index.html', function(err, content) {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset="UTF-8"' });
            res.write(err.message);
            res.end();
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
            res.write(content);
            res.end();
        }
    });
});

//各个模块的路由
var report = require("./router/report.js");
app.use('/report', report);

var server = app.listen(8080, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});