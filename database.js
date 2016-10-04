var mysql = require('mysql'); //调用MySQL模块

var config = require('./config.js').dbconf;
var pool = mysql.createPool(config);

var query = function(sql, params, callback) {
    pool.getConnection(function(err, conn) {
        if (err) {
            callback(err, null, null);
            conn.end();
        } else {
            if (!params) {
                conn.query(sql, function(qerr, vals, fields) {
                    conn.release();
                    callback(qerr, vals, fields);
                });
            } else {
                conn.query(sql, params, function(qerr, vals, fields) {
                    conn.release();
                    callback(qerr, vals, fields);
                });
            }

        }
    });
};

module.exports = {
    query: query
};