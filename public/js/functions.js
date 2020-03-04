var name
var color
$(document).ready(function() {
    //var socket = io();
    var socket = io.connect('http://localhost:3000');
    $('form').submit(function(e) {
        e.preventDefault();
        var msg = $('#m').val()
        socket.emit('chat message', msg);
        $('#m').val('');

        return false;
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
        console.log("name: " + name + " color: " + color)
    });

});