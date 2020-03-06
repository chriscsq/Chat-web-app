let name
let color
let userlist
let socketid 
$(document).ready(function() {
    //let socket = io();

    let socket = io.connect('http://localhost:3000');

    $('form').submit(function(e) {
        e.preventDefault();
        let msg = $('#m').val()
        console.log(msg)
        socket.emit('chat message', msg);
        $('#m').val('');

        return false;
    });
    
    socket.on('populate_history', function(chathistory) {
        $('#messages').empty()
        for (let i = 0; i < chathistory.length; i++) {
            $('#messages').append($('<li>').text(chathistory[i]))
        }
        $("#messages").scrollTop($("#messages")[0].scrollHeight);

    });

    socket.on('disconnected', function(data) {
        userlist = data
        console.log('making changes in disonnect')

        $('#users').empty()
        for (let i = 0; i < userlist.length; i++) {
            $('#users').append($('<li>').text(userlist[i]))
        }
    });

    socket.on('send_user_list', function(data) {
        console.log('making changes')
        userlist = data.userlist
        $('#users').empty()
        for (let i = 0; i < userlist.length; i++) {
            $('#users').append($('<li>').text(userlist[i]))
        }
        $('#chat-header').text("Your name is: " + data.name)

    });

    socket.on('connected', function(data) {
        userlist = data.userlist
        socketid = data.socketid
        name = Cookies.get('user')
       // $('#chat-header').text("Your name is: " + data.name)

        $('#users').empty()
        for (let i = 0; i < userlist.length; i++) {
            if (userlist[i].name === name) {
                socket.emit('name_taken')
                name = user.name
            }
            socket.emit('change_name', name)
            $('#users').append($('<li>').text(userlist[i]))
        }
        console.log("here is your name in connected: " + name)
    });

    name = Cookies.get('user')
    //socket.emit('chat message', "/nick " + name)
    console.log("cookie getname: " + name)
    Cookies.set('user',name)
    socket.on('chat message', function(msg) {
        let hex = "#"+color
        $('#messages').append($('<li>').text(msg).css("color",hex))
        $("#messages").scrollTop($("#messages")[0].scrollHeight);

       // console.log(msg.socketid + " name: " + msg.name)
        //$('#messages').html('<div id="'+msg.socketid+'">'+msg.name +'</div> ' + msg.hours + ":" + msg.minutes + " - " + msg)
    });

    socket.on('error message', function(error) {
        $('#messages').append($('<li>').text(error))
    })

    socket.on('serverToClient', function(data) {
        name = data.name
        color = data.color
        userlist = data.userlist
        socketid = data.socketid

        console.log("your name in after connection or nickname: " + name)
        Cookies.set('user', name, { expires: 365 })

        $('#users').empty()
        $('#chat-header').text("Your name is: " + name)
        console.log("name: " + name + " color: " + color)
        for (let i = 0; i < userlist.length; i++) {
            $('#users').append($('<li>').text(userlist[i]))
        }
    });

});
