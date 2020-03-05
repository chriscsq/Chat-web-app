var name
var color
var userlist

$(document).ready(function() {
    //var socket = io();

    console.log("connected!!")
    var socket = io.connect('http://localhost:3000');
    $('form').submit(function(e) {
        e.preventDefault();
        var msg = $('#m').val()
        console.log(msg)
        socket.emit('chat message', msg);
        $('#m').val('');
        $("#messages").scrollTop($("#messages")[0].scrollHeight);

        return false;
    });

    socket.on('lmao', function(data) {
        console.log("lmao")
        console.log(data)
        $('#chat-header').text("Your name is: " + data)
    });

    socket.on('disconnected', function(data) {
        console.log('disconnect event')
        userlist = data

        $('#users').empty()
        for (var i = 0; i < userlist.length; i++) {
            $('#users').append($('<li>').text(userlist[i]))
        }
    });

    socket.on('connected', function(data) {
        userlist = data.userlist
        console.log("connected")
        $('#chat-header').text("Your name is: " + data.name)

        $('#users').empty()
        for (var i = 0; i < userlist.length; i++) {
            $('#users').append($('<li>').text(userlist[i]))
        }
    });

    socket.on('chat message', function(msg) {
        var hex = "#"+color
        $('#messages').append($('<li>').text(msg).css("color",hex))
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
        for (var i = 0; i < userlist.length; i++) {
            $('#users').append($('<li>').text(userlist[i]))
        }
    });

});