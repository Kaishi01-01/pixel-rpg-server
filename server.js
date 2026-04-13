const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http,{
cors:{origin:"*"}
});

let players = {};

io.on('connection', socket=>{

players[socket.id]={x:100,y:100};

socket.emit("currentPlayers", players);

socket.broadcast.emit("newPlayer",{
id:socket.id,
x:100,
y:100
});

socket.on("playerMovement", data=>{

players[socket.id].x = data.x;
players[socket.id].y = data.y;

socket.broadcast.emit("playerMoved",{
id:socket.id,
x:data.x,
y:data.y
});
});

socket.on("chatMessage", msg=>{
io.emit("chatMessage", msg);
});

socket.on("disconnect", ()=>{
delete players[socket.id];
io.emit("disconnectPlayer", socket.id);
});
});

socket.on("joinRoom", roomName=>{
socket.join(roomName);
console.log("Player join:", roomName);
});

http.listen(3000, ()=>{
console.log("Server running on port 3000");
});