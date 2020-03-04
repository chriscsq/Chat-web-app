$(document).ready(function() {
    //var socket = io();
    var socket = io.connect('http://localhost:3000');
    $('form').submit(function(e) {
        e.preventDefault();
        var message = $('#m').val()
        socket.emit('chat message', message );
        $('#m').val('');
        return false;

    });

    socket.on('chat message', function(msg) {
        
        $('#messages').append($('<li>').text(msg).css("color","green"));
    });
});