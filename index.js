let express = require('express');
let app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/', function(req, res) {
    res.send('<h1>Hello world </h1>');
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});

var today = new Date();
var hours;
var minutes;

setInterval(updateTime, 60000);
function updateTime() {
    hours = today.getHours() % 12 || 12
    minutes = today.getMinutes()
    console.log('update time');
}

onload = function() {
    updateTime();
}
io.on('connection', function(socket){
    socket.on('chat message', function(msg) {
        console.log('message: ' + msg);
        console.log("time: " + hours + ":" + minutes);

        io.emit('chat message', hours + ":" + minutes + " - " + msg);
    });
});

