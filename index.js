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
        color: "green",
    };
    socket.on('chat message', function(msg) {
        var today = new Date();
        var hours = today.getHours() % 12 || 12
        var minutes = (today.getMinutes() < 10) ? "0"+today.getMinutes() : today.getMinutes();
    

        // Should be the command 
        var chat_commands = msg.split(" ")[0];
        // The value for the command
        var command_value = msg.split(" ")[1]

        /* Chat commands */
        if (chat_commands === "/nick") {
            user.name = command_value;
            console.log("changed nickname from " + user.name + "to " + command_value);
        } else if (chat_commands === "/nickcolor") {
            user.color = command_value;
        } else if (chat_commands.charAt(0) === "/") {
            console.log("invalid output")
            socket.emit('chat message', 'Invalid command, please try again');
        } else {
            io.emit('chat message', user.name + " " + hours  + ":" + minutes + " - " + msg);
        }


    });
});

function changeName(user, name) {
    user.name = name
}

function assignName(id) {
    return "User " + id;
}
