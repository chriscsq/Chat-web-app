let name
let color
let userlist

$(document).ready(function() {
    //let socket = io();

    let socket = io.connect('http://localhost:3000');
    $('form').submit(function(e) {
        e.preventDefault();
        let msg = $('#m').val()
        socket.emit('chat message', msg);
        $('#m').val('');

        return false;
    });

    if (name != "undefined") {
        name = Cookies.get('user')
    }

    socket.on('connect', function() {
        let cookie = Cookies.get('user')
        socket.emit('cookiehandler', cookie)

    })



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
        $('#users').empty()
        for (let i = 0; i < userlist.length; i++) {
            $('#users').append($('<li>').text(userlist[i]))
        }
    });

    socket.on('connected', function(data) {
        userlist = data.userlist
        $('#chat-header').text("Your name is: " + data.name)
        Cookies.set('user', data.name, {expires: 365})
        $('#users').empty()
        for (let i = 0; i < userlist.length; i++) {
            $('#users').append($('<li>').text(userlist[i]))
        }
    });

    socket.on('chat message', function(msg) {
        let hex = "#"+msg.color
        if (socket.id === msg.socketid) {
            $('#messages').append('<li><span class="msgfrom" style="color:'+hex+';font-weight:bold" id="'+msg.socketid+'">' + msg.name + '</span>' + msg.messagecontent + '</li>')

        } else {
            $('#messages').append('<li><span class="msgfrom" style="color:'+hex+';" id="'+msg.socketid+'">' + msg.name + '</span>' + msg.messagecontent + '</li>')

        }
        
        $("#messages").scrollTop($("#messages")[0].scrollHeight);
    });

    socket.on('error message', function(error) {
        $('#messages').append($('<li>').text(error))
    })

    socket.on('serverToClient', function(data) {
        name = data.name
        color = data.color
        userlist = data.userlist
        $('#users').empty()
        console.log('dataname in servertoclient ' + data.name)
        Cookies.set('user', data.name, {expires: 365})
    
        $('#chat-header').text("Your name is: " + name)
        for (let i = 0; i < userlist.length; i++) {
            $('#users').append($('<li>').text(userlist[i]))
        }
    });

});

