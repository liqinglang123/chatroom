const { Socket } = require('dgram');

var app = require('express')();

var server = require('http').Server(app);

var io = require('socket.io')(server);

app.use(require('express').static('public'));

app.get('/', (req, res) => {
    res.redirect('/index.html');
});

server.listen(3000, () => {
    console.log('Server is running ....');
});

const Users = [];

io.on('connection', socket => {
    console.log('有用户上线了');


    socket.on('login', data => {
        // console.log(data);

        var user = Users.find(item => item.username === data.username);

        if (user) {
            socket.emit('loginFail', data);
            return;
        } else {
            socket.emit('loginSuccess', data);

            Users.unshift(data);

            io.emit('addNew', data);
            io.emit('userList', Users);

            socket.username = data.username;
            socket.portrait = data.portrait;

        }
    });

    socket.on('sendMessage', data => {
        // console.log(data);

        io.emit('receiveMessage', data);
    });

    socket.on('sendImg', data => {
        // console.log(data);
        io.emit('receiveImg', data);
    });

    socket.on('disconnect', () => {
        var id = Users.findIndex(item => item.username === socket.username);

        Users.splice(id, 1);
        io.emit('userOut', {
            username: socket.username,
            portrait: socket.portrait
        });
        io.emit('userList', Users);
    });

});