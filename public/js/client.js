let name
let color
let userlist

$(document).ready(function() {
    //let socket = io();

    console.log("connected!!")
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
        console.log('disconnect event')
        userlist = data

        $('#users').empty()
        for (let i = 0; i < userlist.length; i++) {
            $('#users').append($('<li>').text(userlist[i]))
        }
    });

    socket.on('send_user_list', function(data) {
        userlist = data
        console.log("connected")
        $('#users').empty()
        for (let i = 0; i < userlist.length; i++) {
            $('#users').append($('<li>').text(userlist[i]))
        }
    });
    socket.on('connected', function(data) {
        userlist = data.userlist
        console.log("connected")
        $('#chat-header').text("Your name is: " + data.name)

        $('#users').empty()
        for (let i = 0; i < userlist.length; i++) {
            $('#users').append($('<li>').text(userlist[i]))
        }
    });

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
        console.log("work")
        name = data.name
        color = data.color
        userlist = data.userlist
        console.log("userlist" + userlist)
        $('#users').empty()
        $('#chat-header').text("Your name is: " + name)
        console.log("name: " + name + " color: " + color)
        for (let i = 0; i < userlist.length; i++) {
            $('#users').append($('<li>').text(userlist[i]))
        }
    });

});