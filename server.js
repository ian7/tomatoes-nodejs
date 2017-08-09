/*global require,static*/

var nodeStatic = require('node-static');

//
// Create a node-static server instance to serve the './public' folder
//
var file = new(nodeStatic.Server)('./public');


var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'watering.cx44b8lvz89x.eu-central-1.rds.amazonaws.com',
    user: 'frontend',
    password: 'pipipipi',
    insecureAuth: true,
    database: 'watering'
});

connection.connect();

//connection.end();


var restify = require('restify');
var httpServer = restify.createServer();


// Process GET
httpServer.get('/weather', function(req, res) {
    var values = [];
    connection.query('SELECT * FROM  weather ORDER BY  weather.id DESC LIMIT 0 , 100', function(err, rows, fields) {
        var i = 0;

        res.writeHead(200, {
          "Content-Type": "application/json"
        });

        for (i = 0; i < rows.length; i++) {
            values.unshift(rows[i]);
        }

        res.write(JSON.stringify(values));
        res.end();
    });
});

httpServer.get('/weather/:attribute', function(req, res) {
    var values = [];
    var attr =  req.params.attribute 
    connection.query('SELECT '+ attr +' FROM  weather ORDER BY  weather.id DESC LIMIT 0 , 100', function(err, rows, fields) {
        var i = 0;

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        for (i = 0; i < rows.length; i++) {
            values.unshift(rows[i][attr]);
        }

        res.write(JSON.stringify(values));
        res.end();
    });
});

httpServer.get('_ah/health', function(req, res, next) {
        res.writeHead(200, {
            "Content-Type": "text/plain"
        });


        res.write('it works');
        res.end();
});



// Serve static files
httpServer.get(/^\/.*/, function(req, res, next) {
    file.serve(req, res, next);
});


httpServer.listen(8080);

/*

httpServer.createServer(function (request, response) {
    request.addListener('end', function () {
        //
        // Serve files!
        //
        file.serve(request, response);
    }).resume();
}).listen(9999);
*/