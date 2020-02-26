$(document).ready(function() {
    var socket = io();
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