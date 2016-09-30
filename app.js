var express = require('express');
var app = express();

app.use(express.static('www'));

//设置静态首页
app.get(/^\/(index(\.html)?)?/,function(req, res){
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

var server = app.listen(80, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});