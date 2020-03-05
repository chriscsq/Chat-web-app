let express = require('express');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

//app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});


http.listen(3000, function() {
    console.log('listening on *:3000');
});

let users = new Array()
let history = new Array()


io.on('connection', function(socket){

    let user = {
        socket: socket.id,
        name: assignName(1),
        color: "black",
    }

    users.push(user)
    let userlist = refreshUserList(socket.id, "connect", "")
    //io.emit('connected', userlist)
    io.to(`${socket.id}`).emit('connected', {
        userlist: userlist,
        name: user.name,
    });

    io.to(`${socket.id}`).emit('populate_history', history)
    io.emit('send_user_list', userlist)

    let username = user.name
    console.log(username)
    /*
    socket.on('connected', function() {
        console.log("this should work")
        console.log("username: " + username)
        socket.emit('connected', username)
    });
    */
    socket.on('disconnect', function() {
        io.emit('disconnected', refreshUserList(socket.id, "disconnect", ""))
        for (let i = 0; i < users.length; i++) {
            if (users[i].socket == socket.id) {
                users.splice(i, 1)
            }
        }
        console.log(users)
        //userlist = refreshUserList(socket.id, "disconnect");
    });
    socket.on('chat message', function(msg) {
        let today = new Date();
        let hours = today.getHours() % 12 || 12
        let minutes = (today.getMinutes() < 10) ? "0"+today.getMinutes() : today.getMinutes();
    
        /* 
         * User input
         */
        let chat_commands = msg.split(" ")[0]
        let command_value = msg.split(" ")[1]
        let invalid_input = msg.split(" ")[2]

        /* 
         * Command to change nickanme
         */
        if (chat_commands === "/nick") {
            if (isInvalidInput(invalid_input)){
                socket.emit('error message', "Invalid input, please check your command")
            } else if (isNameAvailable(command_value) === true) {
                user.name = command_value

                io.to(`${socket.id}`).emit('serverToClient', {
                    name: user.name,
                    color: user.color,
                    userlist: refreshUserList(socket.id, "changenick", user.name),
                });
                
            } else {
                socket.emit('error message', "Name already taken")
            }

        /* 
         * Nickcolor command, checks for valid hexcolor 
         */

        } else if (chat_commands === "/nickcolor") {
            if (isInvalidInput(invalid_input) || !isHexColor(command_value)) {
                socket.emit('error message', "Invalid input, please check your command")
            } else {
                user.color = command_value;
                io.emit('serverToClient', {
                    name: user.name,
                    color: user.color,
                    userlist: refreshUserList(socket.id, "changecolor", user.name),

                });
            }
        } else if (chat_commands.charAt(0) === "/") {
            socket.emit('error message', 'Invalid command, please try again');
        } else {
            /* Does not send empty messages */
            if (msg != "") {
                color = user.color;
                socketid = user.socket;
                name = user.name;
                console.log("form server - id: " + user.socket + " name: " + user.name)
                let savedmessage = user.name +  " " + hours  + ":" + minutes + " - " + msg
                io.emit('chat message',  savedmessage);
                history.push(savedmessage)
                /*io.emit('chat message', {
                    name: user.name,
                    hours: hours,
                    minutes: minutes,
                    color: user.color,
                    msg: msg,
                    socketid: user.socket,
                });
                */
               console.log(history)
            }
        }
        refreshUserList();
    });
});

function assignName(id) {
    let username = "User"+id
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
    for (let i = 0; i < users.length; i++) {
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


function refreshUserList(socketid, action, newnick) {
    let usernames = []
    switch (action) {
        case "connect":
            for (let i = 0; i < users.length; i++) {
                usernames.push(users[i].name)
            }
            break;
        case "disconnect":
            for (let i = 0; i < users.length; i++) {
                if (users[i].socket != socketid) {
                    usernames.push(users[i].name)
                }
            }
            break;
        case "changenick":
            for (let i = 0; i < users.length; i++) {
                if (socketid === users[i].socket) {
                    usernames.push(newnick)
                } else {
                    usernames.push(users[i].name)
                }
            }
            break;
        default:
            for (let i = 0; i < users.length; i++) {
                usernames.push(users[i].name)
            }
            break;
    }

    return usernames;
}