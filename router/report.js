var express = require('express');
var router = express.Router();
var db = require('../database');
var fs = require("fs");

// 该路由使用的中间件
router.use(function timeLog(req, res, next) {
    next();
});

router.post('/save', function(req, res) {
    var params = req.body;
    console.log(params);
    var paramsArray = [params.name, params.tel, params.job, Math.floor(params.sex), Math.floor(params.age), params.option];
    db.query('insert into tb_20161001(name,tel,job,sex,age,options) values(?,?,?,?,?,?)', paramsArray, function(err, rows, fileds) {
        var returnData = {};
        if (err) {
            console.log(err);
            returnData = {
                code: -1,
                info: "数据库插入失败",
                data: null
            };
        } else {
            returnData = {
                code: "0",
                info: "添加成功",
                data: null
            };
        }
        res.writeHead(200, { 'Content-type': 'application/json; charset=UTF-8' });
        res.write(JSON.stringify(returnData));
        res.end();
    });
});

router.get('/downReport', function(req, res) {
    var params = req.query;
    var paramsArray = [params.startTime, params.endTime];
    db.query('select * from tb_20161001 where createtime >= ? and createtime<= ?', paramsArray, function(err, rows, fileds) {
        var returnData = {};
        if (err) {
            console.log(err);
            returnData = {
                code: -1,
                info: "数据库查询失败",
                data: null
            };
            res.writeHead(200, { 'Content-type': 'application/json; charset=UTF-8' });
            res.write(JSON.stringify(returnData));
            res.end();
            return;
        }

        var excel = require('../utils/excelHelper.js');

        var conf = [{
            "name": "用户报名",
            "data": [
                ["序列号", "用户姓名", "电话", "职业", "性别", "年龄", "选中球场", "备注", "投票时间"]
            ]
        }];
        for (var i in rows) {
            var d = rows[i];
            var sex = d.sex == 1 ? "男" : "女";
            conf[0].data.push([d.id, d.name, d.tel, d.job, sex, d.age, d.options, d.remark, d.createtime]);
        }
        var filename = params.startTime + "至" + params.endTime + ".xlsx";
        res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURIComponent(filename));
        excel.createExcel({
            data: conf,
            savePath: "upload/excel/",
            cb: function(path) {
                if (path === null) {
                    returnData = {
                        code: -1,
                        info: "文件不存在",
                        data: null
                    };
                    res.writeHead(200, { 'Content-type': 'application/json; charset=UTF-8' });
                    res.write(JSON.stringify(returnData));
                    res.end();
                    return;
                }
                //excel.download(path, req, res, true);
                res.download(path,filename, function(err){
                    fs.unlink(path, function(err, res) {});
                });
            }
        });
    });
});

module.exports = router;
