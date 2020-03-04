let express = require('express');
let app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);



//app.use(cookieParser());

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});


http.listen(3000, function() {
    console.log('listening on *:3000');
});

var users = new Array()
io.on('connection', function(socket){

    console.log(socket.id + " connected");
    var user = {
        socket: socket.id,
        name: assignName(io.engine.clientsCount),
        color: "black",
    }

    users.push(user);

    socket.on('chat message', function(msg) {
        var today = new Date();
        var hours = today.getHours() % 12 || 12
        var minutes = (today.getMinutes() < 10) ? "0"+today.getMinutes() : today.getMinutes();
    

        // Should be the command 
        var chat_commands = msg.split(" ")[0]
        // The value for the command
        var command_value = msg.split(" ")[1]
        var invalid_input = msg.split(" ")[2]

        console.log('invalid input: ' + invalid_input)
        /* Chat commands */
        if (chat_commands === "/nick") {
            if (isInvalidInput(invalid_input)){
                socket.emit('chat message', "Invalid input, please check your command")
            } else if (isNameAvailable(command_value) === true) {
                user.name = command_value
            } else {
                socket.emit('chat message', "Name already taken")
            }
        } else if (chat_commands === "/nickcolor") {
            if (isInvalidInput(invalid_input)) {
                socket.emit('chat message', "Invalid input, please check your command")
            } else {
                user.color = command_value;
            }
        } else if (chat_commands.charAt(0) === "/") {
            socket.emit('chat message', 'Invalid command, please try again');
        } else {
            io.emit('chat message', user.name + " " + hours  + ":" + minutes + " - " + msg);
        }


        console.log(users);
    });
});

function assignName(id) {
    var username = "User"+id
    while (!isNameAvailable(username)) {
        username = "User"+(id++)
        console.log("incrementing user id")
        console.log("Name will be: User"+(id++))
    }
    return username
}

function isInvalidInput(invalid_input) {
    if (typeof invalid_input === 'undefined') {
        return false
    }
    return true
}
function isNameAvailable(name_to_check) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].name === name_to_check) {
            console.log("check name availability failed")
            return false;
        }
    }
    return true;
}


