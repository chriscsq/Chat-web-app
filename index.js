let express = require('express');
let app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);


//app.use(cookieParser());

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


io.on('connection', function(socket){

    console.log(socket.id + " connected");
    var user = {
        socket: socket.id,
        name: assignName(io.engine.clientsCount),
    };
    socket.on('chat message', function(msg) {
        var today = new Date();
        var hours = today.getHours() % 12 || 12
        var minutes = (today.getMinutes() < 10) ? "0"+today.getMinutes() : today.getMinutes();
    
        io.emit('chat message', user.name + " " + hours  + ":" + minutes + " - " + msg);

        /* Check message for chat commands
    });
});

function changeName(user, name) {
    user.name = name
}

function assignName(id) {
    return "User " + id;
}
