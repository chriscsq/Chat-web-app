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

        /* Chat commands */
        if (chat_commands === "/nick") {
            if (isInvalidInput(invalid_input)){
                socket.emit('error message', "Invalid input, please check your command")
            } else if (isNameAvailable(command_value) === true) {
                user.name = command_value

                socket.emit('serverToClient', {
                    name: user.name,
                    color: user.color,
                });

            } else {
                socket.emit('error message', "Name already taken")
            }
        } else if (chat_commands === "/nickcolor") {
            if (isInvalidInput(invalid_input) || !isHexColor(command_value)) {
                socket.emit('error message', "Invalid input, please check your command")
            } else {
                user.color = command_value;
                socket.emit('serverToClient', {
                    name: user.name,
                    color: user.color,
                });
            }
        } else if (chat_commands.charAt(0) === "/") {
            socket.emit('error message', 'Invalid command, please try again');
        } else {
            io.emit('chat message',  user.name +  " " + hours  + ":" + minutes + " - " + msg);
        }


        console.log(users);
    });
});

function assignName(id) {
    var username = "User"+id
    while (!isNameAvailable(username)) {
        username = "User"+(id++)
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
            return false;
        }
    }
    return true;
}


// Stole function to validate hex - https://stackoverflow.com/questions/8027423/how-to-check-if-a-string-is-a-valid-hex-color-representation/8027444
function isHexColor (hex) {
    return typeof hex === 'string'
        && hex.length === 6
        && !isNaN(Number('0x' + hex))
  }