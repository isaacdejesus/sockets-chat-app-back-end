"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("./router"));
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("./users"));
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const app = require('express')();
app.use(cors());
app.use(express_1.default.json());
app.use(router_1.default);
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});
io.on('connection', (socket) => {
    socket.on('join', ({ name, room }, callback) => {
        const user = users_1.default.addUser({ id: socket.id, name, room });
        if (user) {
            socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}` });
            socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined` });
            socket.join(user.room);
            io.to(user.room).emit('roomData', { room: user.room, users: users_1.default.getUsersInRoom(user.room) });
            if (typeof callback === 'function')
                callback();
        }
        else
            return callback("User already exists");
    });
    socket.on('sendMessage', (message, callback) => {
        console.log("I am here trying to send data from backend");
        const user = users_1.default.getUser(socket.id);
        console.log(user);
        if (user) {
            console.log("I exist");
            io.to(user.room).emit('message', { user: user.name, text: message });
            io.to(user.room).emit('roomData', { room: user.room, users: users_1.default.getUsersInRoom(user.room) });
        }
        if (typeof callback === 'function')
            callback();
    });
    socket.on('disconnect', () => {
        const user = users_1.default.removeUser(socket.id);
        if (user)
            io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left` });
    });
    socket.on('disconnect', () => {
        console.log('User has left the room');
    });
});
httpServer.listen(PORT);
