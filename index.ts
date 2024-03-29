import router from './router';
import express from 'express';
import  userService  from './users';
const cors = require('cors');
//const PORT = process.env.PORT || 5000;
const PORT = process.env.PORT || 8080;
const app = require('express')();
app.use(cors());
app.use(express.json());
app.use(router);
import {  Socket } from 'socket.io';
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
    cors: {
        //origin: "http://localhost:3000",
        origin: "*",
        methods: ["GET", "POST"],
    }
});

io.on('connection', (socket: Socket ) => {
    socket.on('join', ({name, room}, callback) => {
        const  user  = userService.addUser({id: socket.id, name, room});
        if(user){
            socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}` });
            socket.broadcast.to(user.room).emit('message', {user: 'admin', text: `${user.name}, has joined`});
            socket.join(user.room);
            io.to(user.room).emit('roomData', {room: user.room, users: userService.getUsersInRoom(user.room)});
            if(typeof callback === 'function')
                callback();
        }
        else return callback("User already exists");
    });
    socket.on('sendMessage', (message, callback) => {
            console.log("I am here trying to send data from backend");
        const user = userService.getUser(socket.id);
        console.log(user);
        if(user)
        {
            console.log("I exist");
            io.to(user.room).emit('message', { user: user.name, text: message });
            io.to(user.room).emit('roomData', {room: user.room, users: userService.getUsersInRoom(user.room)});
        }
        if(typeof callback === 'function')
            callback();

    });
    socket.on('disconnect', () => {
        const user = userService.removeUser(socket.id);
        if(user)
            io.to(user.room).emit('message', {user: 'admin', text: `${user.name} has left`})
    })
    socket.on('disconnect', () => {
        console.log('User has left the room');
    })
});


httpServer.listen(PORT);
