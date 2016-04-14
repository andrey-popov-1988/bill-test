var http = require('http'),
    fs = require('fs'),
    // NEVER use a Sync function except at start-up!
    index = fs.readFileSync(__dirname + '/index.html');
var socketServer = require('socket.io');

// Send index.html to all requests
var app = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    if(req.url=='/index.html' || req.url=='/') {
        res.end(index);
    } else {
        var p = __dirname + '/' + req.url;
        index = fs.readFileSync(p);
        res.end(index);
    }
});


var io = socketServer.listen(app);

var spawn = require('child_process').spawn,
    py = spawn('python',['../Simulator/main.py', "/dev/ttyS0"]);

var sleep = require('sleep');
var timeout = 500; //sleep 100 seconds

//var flag = true;

var write_value_to_python = function(data) {
    //py.stdin.write(JSON.stringify(data.bill_type) + '\r');
    //py.stdin.end();
}

py.stdin.setEncoding('utf8');

io.on('connection', function (socket) {
    py.stdout.on('data', function (data) {
        console.log('py-stdout: ' + data);
        //flag = true;
    });

    py.stdout.on('close', function (data) {
        console.log('py-result:' + data);
        socket.emit('result', { success: 'success', data: data.toString() });
    });

    py.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
        socket.emit('result', { success: 'failed', data: data.toString() });
    });

    socket.on('bill-type', function (data) {
        console.log(data.bill_type);
        //if (flag == true) {
        py.stdin.write(JSON.stringify(data.bill_type) + "\n");
        //setTimeout(write_value_to_python(data), 1000);
        //flag = false;
        //}
    });

    socket.emit('result', { success: 'success', data: 'connected-server!' });

});

console.log('Server running(port: 3000).');

app.listen(3000);
