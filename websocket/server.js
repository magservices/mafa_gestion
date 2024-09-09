const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Gérer les connexions WebSocket avec Socket.IO
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('message', (msg) => {
        console.log('Message received:', msg);
        socket.send('Message received');
    });
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Servir les fichiers statiques (si vous avez une interface web à tester)
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
