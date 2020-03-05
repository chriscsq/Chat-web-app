var name
var color
var userlist

$(document).ready(function() {
    //var socket = io();
    var socket = io.connect('http://localhost:3000');
    $('form').submit(function(e) {
        e.preventDefault();
        var msg = $('#m').val()
        console.log(msg)
        socket.emit('chat message', msg);
        $('#m').val('');

        return false;
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
        console.log('connected')
        userlist = data

        $('#users').empty()
        for (var i = 0; i < userlist.length; i++) {
            $('#users').append($('<li>').text(userlist[i]))
        }
    });

    socket.on('chat message', function(msg) {
        var hex = "#"+color
        $('#messages').append($('<li>').text(msg).css("color",hex))
        
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

        console.log("name: " + name + " color: " + color)
        for (var i = 0; i < userlist.length; i++) {
            $('#users').append($('<li>').text(userlist[i]))
        }
    });

});