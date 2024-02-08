const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.origins('*:*');

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', (message) => {
    console.log('Received message:', message);
 
    io.emit('message', message);
  });


  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
