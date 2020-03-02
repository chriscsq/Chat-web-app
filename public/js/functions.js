$(document).ready(function() {
    //var socket = io();
    var socket = io.connect('http://localhost:3000');
    $('form').submit(function(e) {
        var today = new Date();
        e.preventDefault();
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });

    socket.on('chat message', function(msg) {
        
        $('#messages').append($('<li>').text(msg));
    });
});