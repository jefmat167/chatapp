const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: "*" } });

const formatMessage = require('./utils/messages'); 
const { joinRoom, getCurrentUser, leaveRoom, getAllUsers } = require('./utils/users');

app.set('view engine', 'ejs');

app.get('/chat', (req, res) => {
    res.render('index');
});

const chatBot = 'chatApp';

io.on('connection', socket => {
    console.log(`New connection: ${socket.id}`);

    //user joins chat
    socket.on('joinRoom', ({ username, room }) => {
        const user = joinRoom(socket.id, username, room);
        socket.join(user.room);

        //welcome message to the user the connects (current user)
        socket.emit('message', formatMessage(chatBot, 'welcome to chatApp'));

        //notify every other user that a new user has joined...
        socket.broadcast
            .to(user.room)
            .emit('message', formatMessage(chatBot, `${user.username} has joined the chat`));

    });


    //listen for and broadcast chat to the group
    socket.on('chatMessage', message => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, message));
    });

    //notify everybody of a user's exit
    socket.on('disconnect', () => {
        console.log('A user has left...');
        const user = leaveRoom(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMessage(user.username, ' left the room'));
        }
    })
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});

